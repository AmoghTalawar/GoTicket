package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

// SupabaseClient handles communication with Supabase
type SupabaseClient struct {
	URL            string
	AnonKey        string
	ServiceRoleKey string
	Client         *http.Client
}

// NewSupabaseClient creates a new Supabase client
func NewSupabaseClient(url, anonKey, serviceRoleKey string) *SupabaseClient {
	return &SupabaseClient{
		URL:            url,
		AnonKey:        anonKey,
		ServiceRoleKey: serviceRoleKey,
		Client:         &http.Client{Timeout: 10 * time.Second},
	}
}

// User represents a user in the system
type User struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	Username    string `json:"username"`
	AccountType string `json:"account_type"`
	CreatedAt   string `json:"created_at"`
}

// Event represents an event in the system
type Event struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	EventDate   string  `json:"event_date"`
	Location    string  `json:"location"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	Capacity    *int    `json:"capacity"`
	OrganizerID string  `json:"organizer_id"`
	ImageURL    string  `json:"image_url"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

// Registration represents a user's registration for an event
type Registration struct {
	ID               string `json:"id"`
	EventID          string `json:"event_id"`
	UserID           string `json:"user_id"`
	RegistrationDate string `json:"registration_date"`
	Status           string `json:"status"`
	Notes            string `json:"notes"`
	CreatedAt        string `json:"created_at"`
}

// RegisterRequest represents registration input
type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	Username    string `json:"username"`
}

// CreateEventRequest represents event creation input
type CreateEventRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	EventDate   string  `json:"event_date"`
	Location    string  `json:"location"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	Capacity    *int    `json:"capacity"`
	ImageURL    string  `json:"image_url"`
}

// EventRegistrationRequest represents event registration input
type EventRegistrationRequest struct {
	EventID string `json:"event_id"`
	Notes   string `json:"notes"`
}

// CancelRegistrationRequest represents a registration cancellation input
type CancelRegistrationRequest struct {
	RegistrationID string `json:"registration_id"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// AuthResponse represents an authentication response
type AuthResponse struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

// EventWithRegistrations represents an event with its registration count
type EventWithRegistrations struct {
	Event
	RegistrationCount int `json:"registration_count"`
}

// RegistrationWithEvent represents a registration joined with event data
type RegistrationWithEvent struct {
	ID               string `json:"id"`
	EventID          string `json:"event_id"`
	UserID           string `json:"user_id"`
	RegistrationDate string `json:"registration_date"`
	Status           string `json:"status"`
	Notes            string `json:"notes"`
	CreatedAt        string `json:"created_at"`
	Event            Event  `json:"events"`
}

// RateLimiter implements simple rate limiting
type RateLimiter struct {
	requests map[string][]time.Time
	mu       sync.RWMutex
	limit    int
	window   time.Duration
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
}

// IsAllowed checks if a request from the given IP is allowed
func (rl *RateLimiter) IsAllowed(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-rl.window)

	// Clean old requests
	if times, exists := rl.requests[ip]; exists {
		var valid []time.Time
		for _, t := range times {
			if t.After(cutoff) {
				valid = append(valid, t)
			}
		}
		rl.requests[ip] = valid
	}

	// Check limit
	if len(rl.requests[ip]) >= rl.limit {
		return false
	}

	// Add current request
	rl.requests[ip] = append(rl.requests[ip], now)
	return true
}

// Global instances
var (
	supabaseClient *SupabaseClient
	rateLimiter    *RateLimiter
)

func init() {
	// Load .env file (ignore error if file doesn't exist)
	_ = godotenv.Load()

	// Initialize Supabase client
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")
	supabaseServiceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		panic("SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
	}

	supabaseClient = NewSupabaseClient(supabaseURL, supabaseKey, supabaseServiceRoleKey)

	// Initialize rate limiter: 100 requests per hour
	rateLimiter = NewRateLimiter(100, time.Hour)
}

func main() {
	// Setup routes
	router := http.NewServeMux()
	router.HandleFunc("/", enableCORS(handleHome))
	router.HandleFunc("/api/register", enableCORS(rateLimit(handleRegister)))
	router.HandleFunc("/api/login", enableCORS(rateLimit(handleLogin)))
	router.HandleFunc("/api/profile", enableCORS(authenticate(handleProfile)))
	router.HandleFunc("/api/events", enableCORS(handleEvents))
	router.HandleFunc("/api/events/", enableCORS(handleEventDetail))
	router.HandleFunc("/api/registrations", enableCORS(authenticate(handleRegistrations)))
	router.HandleFunc("/api/registrations/cancel", enableCORS(authenticate(handleCancelRegistration)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	fmt.Printf("Supabase URL: %s\n", supabaseClient.URL)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		panic(err)
	}
}

// Middleware functions

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func rateLimit(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := getClientIP(r)

		if !rateLimiter.IsAllowed(ip) {
			sendError(w, http.StatusTooManyRequests, "Rate limit exceeded", "Too many requests. Please try again later.")
			return
		}

		next(w, r)
	}
}

func authenticate(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			sendError(w, http.StatusUnauthorized, "Unauthorized", "Authorization header required")
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid token format")
			return
		}

		// Store token in context for handler use
		r.Header.Set("X-User-Token", token)
		next(w, r)
	}
}

// Handler functions

func handleHome(w http.ResponseWriter, r *http.Request) {
	sendJSON(w, http.StatusOK, map[string]interface{}{
		"message": "GoTicket API Server",
		"version": "1.0.0",
		"endpoints": []map[string]string{
			{"path": "/api/register", "method": "POST", "description": "User registration"},
			{"path": "/api/login", "method": "POST", "description": "User authentication"},
			{"path": "/api/profile", "method": "GET", "description": "User profile (protected)"},
			{"path": "/api/events", "method": "GET", "description": "List all active events"},
			{"path": "/api/events", "method": "POST", "description": "Create a new event (protected)"},
			{"path": "/api/events/{id}", "method": "GET", "description": "Get event details"},
			{"path": "/api/events/{id}", "method": "PUT", "description": "Update event (protected, organizer only)"},
			{"path": "/api/events/{id}", "method": "DELETE", "description": "Cancel event (protected, organizer only)"},
			{"path": "/api/registrations", "method": "GET", "description": "List user registrations (protected)"},
			{"path": "/api/registrations", "method": "POST", "description": "Register for an event (protected)"},
			{"path": "/api/registrations/cancel", "method": "POST", "description": "Cancel a registration (protected)"},
		},
	})
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only POST method is allowed")
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	// Validate input
	if err := validateRegistrationInput(req); err != nil {
		sendError(w, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	// Check if user exists
	exists, err := checkUserExists(req.Email)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to verify user")
		return
	}

	if exists {
		sendError(w, http.StatusConflict, "User exists", "An account with this email already exists")
		return
	}

	// Create user in Supabase
	user, _, err := createSupabaseUser(req)
	if err != nil {
		fmt.Printf("Supabase error: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Registration failed", "Unable to create user account")
		return
	}

	// Create profile manually since trigger is removed
	fmt.Printf("User created successfully: %s\n", user.ID)

	// Create profile using service role key (bypasses RLS)
	err = createUserProfile(user.ID, req.FullName, req.PhoneNumber, req.Email)
	if err != nil {
		fmt.Printf("Profile creation error: %v\n", err)
	} else {
		fmt.Printf("Profile created successfully for user: %s\n", user.ID)
	}

	// Generate JWT token
	token, err := generateJWT(user.ID)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Token error", "Failed to generate authentication token")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   token,
		"message": "Registration successful",
	})
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only POST method is allowed")
		return
	}

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	if req.Email == "" || req.Password == "" {
		sendError(w, http.StatusBadRequest, "Missing fields", "Email and password are required")
		return
	}

	// Authenticate with Supabase
	user, token, err := authenticateSupabaseUser(req.Email, req.Password)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Invalid credentials", "Email or password is incorrect")
		return
	}

	// Generate JWT token
	token, err = generateJWT(user.ID)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Token error", "Failed to generate authentication token")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   token,
		"message": "Login successful",
	})
}

func handleProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only GET method is allowed")
		return
	}

	token := r.Header.Get("X-User-Token")

	// Get user from Supabase
	user, err := getUserFromSupabase(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Invalid token", "Unable to verify user")
		return
	}

	sendJSON(w, http.StatusOK, user)
}

// Helper functions

func validateRegistrationInput(req RegisterRequest) error {
	if req.Email == "" {
		return fmt.Errorf("email is required")
	}

	if !isValidEmail(req.Email) {
		return fmt.Errorf("invalid email format")
	}

	if req.Password == "" {
		return fmt.Errorf("password is required")
	}

	if len(req.Password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	if !isStrongPassword(req.Password) {
		return fmt.Errorf("password must contain uppercase, lowercase, and number")
	}

	if req.FullName == "" {
		return fmt.Errorf("full name is required")
	}

	if len(req.FullName) < 2 {
		return fmt.Errorf("full name must be at least 2 characters")
	}

	if req.PhoneNumber == "" {
		return fmt.Errorf("phone number is required")
	}

	if !isValidPhone(req.PhoneNumber) {
		return fmt.Errorf("invalid phone number format")
	}

	return nil
}

func isValidEmail(email string) bool {
	return strings.Contains(email, "@") && strings.Contains(email, ".")
}

func isValidPhone(phone string) bool {
	// Basic phone validation - allows +, spaces, dashes, and numbers
	cleaned := strings.ReplaceAll(phone, " ", "")
	cleaned = strings.ReplaceAll(cleaned, "-", "")
	cleaned = strings.ReplaceAll(cleaned, "(", "")
	cleaned = strings.ReplaceAll(cleaned, ")", "")
	cleaned = strings.ReplaceAll(cleaned, "+", "")

	return len(cleaned) >= 10 && len(cleaned) <= 15
}

func isStrongPassword(password string) bool {
	hasUpper := false
	hasLower := false
	hasNumber := false

	for _, char := range password {
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
		}
		if char >= 'a' && char <= 'z' {
			hasLower = true
		}
		if char >= '0' && char <= '9' {
			hasNumber = true
		}
	}

	return hasUpper && hasLower && hasNumber
}

func checkUserExists(email string) (bool, error) {
	url := fmt.Sprintf("%s/auth/v1/admin/users?email=%s", supabaseClient.URL, email)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK, nil
}

func createSupabaseUser(req RegisterRequest) (*User, string, error) {
	url := fmt.Sprintf("%s/auth/v1/signup", supabaseClient.URL)

	payload := map[string]interface{}{
		"email":    req.Email,
		"password": req.Password,
		"data": map[string]string{
			"full_name":    req.FullName,
			"phone_number": req.PhoneNumber,
			"username":     req.Username,
			"account_type": "attendee",
		},
		"email_confirm": false,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, "", err
	}

	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, "", err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("apikey", supabaseClient.AnonKey)
	httpReq.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)

	resp, err := supabaseClient.Client.Do(httpReq)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("supabase error: %s", string(body))
	}

	var result struct {
		AccessToken string `json:"access_token"`
		User        struct {
			ID    string `json:"id"`
			Email string `json:"email"`
			Data  struct {
				FullName    string `json:"full_name"`
				PhoneNumber string `json:"phone_number"`
				Username    string `json:"username"`
				AccountType string `json:"account_type"`
			} `json:"raw_user_meta_data"`
			CreatedAt string `json:"created_at"`
		} `json:"user"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, "", err
	}

	return &User{
		ID:          result.User.ID,
		Email:       result.User.Email,
		FullName:    result.User.Data.FullName,
		PhoneNumber: result.User.Data.PhoneNumber,
		Username:    result.User.Data.Username,
		AccountType: result.User.Data.AccountType,
		CreatedAt:   result.User.CreatedAt,
	}, result.AccessToken, nil
}

func authenticateSupabaseUser(email, password string) (*User, string, error) {
	url := fmt.Sprintf("%s/auth/v1/token?grant_type=password", supabaseClient.URL)

	payload := map[string]string{
		"email":    email,
		"password": password,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("authentication failed: %s", string(body))
	}

	var result struct {
		AccessToken string `json:"access_token"`
		User        struct {
			ID    string `json:"id"`
			Email string `json:"email"`
			Data  struct {
				FullName    string `json:"full_name"`
				PhoneNumber string `json:"phone_number"`
				Username    string `json:"username"`
				AccountType string `json:"account_type"`
			} `json:"raw_user_meta_data"`
		} `json:"user"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, "", err
	}

	return &User{
		ID:          result.User.ID,
		Email:       result.User.Email,
		FullName:    result.User.Data.FullName,
		PhoneNumber: result.User.Data.PhoneNumber,
		Username:    result.User.Data.Username,
		AccountType: result.User.Data.AccountType,
	}, result.AccessToken, nil
}

func getUserFromSupabase(token string) (*User, error) {
	url := fmt.Sprintf("%s/auth/v1/user", supabaseClient.URL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get user")
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func generateJWT(userID string) (string, error) {
	// In production, use a proper JWT library like golang-jwt/jwt
	// For now, return a simple token
	return fmt.Sprintf("jwt-token-%s-%d", userID, time.Now().Unix()), nil
}

func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header (for proxies)
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		return strings.Split(xff, ",")[0]
	}

	// Check X-Real-Ip header
	xri := r.Header.Get("X-Real-Ip")
	if xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	return strings.Split(r.RemoteAddr, ":")[0]
}

func sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func sendError(w http.ResponseWriter, status int, error, message string) {
	sendJSON(w, status, ErrorResponse{
		Error:   error,
		Message: message,
		Code:    status,
	})
}

func createUserProfile(userID, fullName, phoneNumber, email string) error {
	url := fmt.Sprintf("%s/rest/v1/profiles?id=eq.%s", supabaseClient.URL, userID)

	payload := map[string]interface{}{
		"id":           userID,
		"full_name":    fullName,
		"phone_number": phoneNumber,
		"email":        email,
		"account_type": "attendee",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.ServiceRoleKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.ServiceRoleKey)
	req.Header.Set("Prefer", "return=minimal")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to create profile: %s", string(body))
	}

	return nil
}

func createUserProfileWithUserToken(userToken, fullName, phoneNumber, email string) error {
	url := fmt.Sprintf("%s/rest/v1/profiles", supabaseClient.URL)

	payload := map[string]interface{}{
		"full_name":    fullName,
		"phone_number": phoneNumber,
		"email":        email,
		"account_type": "attendee",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+userToken)
	req.Header.Set("Prefer", "return=minimal")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to create profile with user token: %s", string(body))
	}

	return nil
}

// =====================================================
// Event Handlers
// =====================================================

func handleEvents(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		handleListEvents(w, r)
	case http.MethodPost:
		// POST requires authentication
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			sendError(w, http.StatusUnauthorized, "Unauthorized", "Authorization header required")
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		r.Header.Set("X-User-Token", token)
		handleCreateEvent(w, r)
	default:
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only GET and POST methods are allowed")
	}
}

func handleListEvents(w http.ResponseWriter, r *http.Request) {
	// Get optional query params for filtering
	category := r.URL.Query().Get("category")
	search := r.URL.Query().Get("search")

	events, err := getEvents(category, search)
	if err != nil {
		fmt.Printf("Error fetching events: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to fetch events")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"events": events,
		"count":  len(events),
	})
}

func handleCreateEvent(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("X-User-Token")

	var req CreateEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	// Validate required fields
	if req.Title == "" {
		sendError(w, http.StatusBadRequest, "Validation error", "Event title is required")
		return
	}
	if req.EventDate == "" {
		sendError(w, http.StatusBadRequest, "Validation error", "Event date is required")
		return
	}

	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	// Create event
	event, err := createEvent(token, userID, req)
	if err != nil {
		fmt.Printf("Error creating event: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to create event")
		return
	}

	sendJSON(w, http.StatusCreated, map[string]interface{}{
		"event":   event,
		"message": "Event created successfully",
	})
}

func handleEventDetail(w http.ResponseWriter, r *http.Request) {
	// Extract event ID from URL path: /api/events/{id}
	path := strings.TrimPrefix(r.URL.Path, "/api/events/")
	eventID := strings.TrimSpace(path)

	if eventID == "" {
		sendError(w, http.StatusBadRequest, "Invalid request", "Event ID is required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleGetEvent(w, r, eventID)
	case http.MethodPut:
		// PUT requires authentication
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			sendError(w, http.StatusUnauthorized, "Unauthorized", "Authorization header required")
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		r.Header.Set("X-User-Token", token)
		handleUpdateEvent(w, r, eventID)
	case http.MethodDelete:
		// DELETE requires authentication
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			sendError(w, http.StatusUnauthorized, "Unauthorized", "Authorization header required")
			return
		}
		token := strings.TrimPrefix(authHeader, "Bearer ")
		r.Header.Set("X-User-Token", token)
		handleDeleteEvent(w, r, eventID)
	default:
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only GET, PUT, and DELETE methods are allowed")
	}
}

func handleGetEvent(w http.ResponseWriter, r *http.Request, eventID string) {
	event, err := getEventByID(eventID)
	if err != nil {
		fmt.Printf("Error fetching event: %v\n", err)
		sendError(w, http.StatusNotFound, "Not found", "Event not found")
		return
	}

	// Get registration count for this event
	count, err := getEventRegistrationCount(eventID)
	if err != nil {
		fmt.Printf("Error fetching registration count: %v\n", err)
		count = 0
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"event":              event,
		"registration_count": count,
	})
}

func handleUpdateEvent(w http.ResponseWriter, r *http.Request, eventID string) {
	token := r.Header.Get("X-User-Token")

	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	// Verify the user is the organizer
	existingEvent, err := getEventByID(eventID)
	if err != nil {
		sendError(w, http.StatusNotFound, "Not found", "Event not found")
		return
	}

	if existingEvent.OrganizerID != userID {
		sendError(w, http.StatusForbidden, "Forbidden", "Only the event organizer can update this event")
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	// Add updated_at timestamp
	updateData["updated_at"] = time.Now().UTC().Format(time.RFC3339)

	// Remove fields that shouldn't be updated directly
	delete(updateData, "id")
	delete(updateData, "organizer_id")
	delete(updateData, "created_at")

	err = updateEvent(token, eventID, updateData)
	if err != nil {
		fmt.Printf("Error updating event: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to update event")
		return
	}

	// Fetch updated event
	updatedEvent, _ := getEventByID(eventID)

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"event":   updatedEvent,
		"message": "Event updated successfully",
	})
}

func handleDeleteEvent(w http.ResponseWriter, r *http.Request, eventID string) {
	token := r.Header.Get("X-User-Token")

	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	// Verify the user is the organizer
	existingEvent, err := getEventByID(eventID)
	if err != nil {
		sendError(w, http.StatusNotFound, "Not found", "Event not found")
		return
	}

	if existingEvent.OrganizerID != userID {
		sendError(w, http.StatusForbidden, "Forbidden", "Only the event organizer can cancel this event")
		return
	}

	err = deleteEvent(token, eventID)
	if err != nil {
		fmt.Printf("Error cancelling event: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to cancel event")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Event cancelled successfully",
	})
}

// =====================================================
// Registration Handlers
// =====================================================

func handleRegistrations(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("X-User-Token")

	switch r.Method {
	case http.MethodGet:
		handleListRegistrations(w, r, token)
	case http.MethodPost:
		handleCreateRegistration(w, r, token)
	default:
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only GET and POST methods are allowed")
	}
}

func handleListRegistrations(w http.ResponseWriter, r *http.Request, token string) {
	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	// Optional status filter
	status := r.URL.Query().Get("status")

	registrations, err := getUserRegistrations(token, userID, status)
	if err != nil {
		fmt.Printf("Error fetching registrations: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to fetch registrations")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"registrations": registrations,
		"count":         len(registrations),
	})
}

func handleCreateRegistration(w http.ResponseWriter, r *http.Request, token string) {
	var req EventRegistrationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	if req.EventID == "" {
		sendError(w, http.StatusBadRequest, "Validation error", "Event ID is required")
		return
	}

	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	// Check if event exists and is active
	event, err := getEventByID(req.EventID)
	if err != nil {
		sendError(w, http.StatusNotFound, "Not found", "Event not found")
		return
	}

	if event.Status != "active" {
		sendError(w, http.StatusBadRequest, "Event unavailable", "This event is no longer accepting registrations")
		return
	}

	// Check capacity
	if event.Capacity != nil {
		count, err := getEventRegistrationCount(req.EventID)
		if err != nil {
			fmt.Printf("Error checking registration count: %v\n", err)
		} else if count >= *event.Capacity {
			sendError(w, http.StatusConflict, "Event full", "This event has reached its maximum capacity")
			return
		}
	}

	// Create registration
	registration, err := createRegistration(token, req.EventID, userID, req.Notes)
	if err != nil {
		// Check if it's a unique constraint violation (already registered)
		if strings.Contains(err.Error(), "duplicate") || strings.Contains(err.Error(), "unique") || strings.Contains(err.Error(), "23505") {
			sendError(w, http.StatusConflict, "Already registered", "You are already registered for this event")
			return
		}
		fmt.Printf("Error creating registration: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to create registration")
		return
	}

	sendJSON(w, http.StatusCreated, map[string]interface{}{
		"registration": registration,
		"message":      "Registration successful",
	})
}

func handleCancelRegistration(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only POST method is allowed")
		return
	}

	token := r.Header.Get("X-User-Token")

	var req CancelRegistrationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request", "Invalid JSON format")
		return
	}

	if req.RegistrationID == "" {
		sendError(w, http.StatusBadRequest, "Validation error", "Registration ID is required")
		return
	}

	// Get user ID from token
	userID, err := getUserIDFromToken(token)
	if err != nil {
		sendError(w, http.StatusUnauthorized, "Unauthorized", "Invalid or expired token")
		return
	}

	err = cancelRegistration(token, req.RegistrationID, userID)
	if err != nil {
		fmt.Printf("Error cancelling registration: %v\n", err)
		sendError(w, http.StatusInternalServerError, "Server error", "Unable to cancel registration")
		return
	}

	sendJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Registration cancelled successfully",
	})
}

// =====================================================
// Supabase REST Helper Functions
// =====================================================

// getUserIDFromToken extracts the user ID from a Supabase auth token
func getUserIDFromToken(token string) (string, error) {
	url := fmt.Sprintf("%s/auth/v1/user", supabaseClient.URL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("failed to get user: %s", string(body))
	}

	var result struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.ID, nil
}

// getEvents fetches all active events with optional filtering
func getEvents(category, search string) ([]Event, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/events?status=eq.active&order=event_date.asc", supabaseClient.URL)

	if category != "" {
		queryURL += fmt.Sprintf("&category=eq.%s", category)
	}
	if search != "" {
		queryURL += fmt.Sprintf("&title=ilike.*%s*", search)
	}

	req, err := http.NewRequest("GET", queryURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch events: %s", string(body))
	}

	var events []Event
	if err := json.Unmarshal(body, &events); err != nil {
		return nil, err
	}

	return events, nil
}

// getEventByID fetches a single event by its ID
func getEventByID(eventID string) (*Event, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/events?id=eq.%s", supabaseClient.URL, eventID)

	req, err := http.NewRequest("GET", queryURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)
	req.Header.Set("Accept", "application/json")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch event: %s", string(body))
	}

	var events []Event
	if err := json.Unmarshal(body, &events); err != nil {
		return nil, err
	}

	if len(events) == 0 {
		return nil, fmt.Errorf("event not found")
	}

	return &events[0], nil
}

// createEvent inserts a new event into Supabase
func createEvent(token, organizerID string, req CreateEventRequest) (*Event, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/events", supabaseClient.URL)

	payload := map[string]interface{}{
		"title":        req.Title,
		"description":  req.Description,
		"event_date":   req.EventDate,
		"location":     req.Location,
		"category":     req.Category,
		"price":        req.Price,
		"capacity":     req.Capacity,
		"image_url":    req.ImageURL,
		"organizer_id": organizerID,
		"status":       "active",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", queryURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("apikey", supabaseClient.AnonKey)
	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("Prefer", "return=representation")

	resp, err := supabaseClient.Client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to create event: %s", string(body))
	}

	var events []Event
	if err := json.Unmarshal(body, &events); err != nil {
		return nil, err
	}

	if len(events) == 0 {
		return nil, fmt.Errorf("event created but no data returned")
	}

	return &events[0], nil
}

// updateEvent patches an existing event in Supabase
func updateEvent(token, eventID string, data map[string]interface{}) error {
	queryURL := fmt.Sprintf("%s/rest/v1/events?id=eq.%s", supabaseClient.URL, eventID)

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("PATCH", queryURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Prefer", "return=minimal")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to update event: %s", string(body))
	}

	return nil
}

// deleteEvent soft-deletes an event by setting its status to 'cancelled'
func deleteEvent(token, eventID string) error {
	return updateEvent(token, eventID, map[string]interface{}{
		"status":     "cancelled",
		"updated_at": time.Now().UTC().Format(time.RFC3339),
	})
}

// getUserRegistrations fetches all registrations for a user, joined with event data
func getUserRegistrations(token, userID, status string) ([]RegistrationWithEvent, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/registrations?user_id=eq.%s&select=*,events(*)", supabaseClient.URL, userID)

	if status != "" {
		queryURL += fmt.Sprintf("&status=eq.%s", status)
	}

	queryURL += "&order=created_at.desc"

	req, err := http.NewRequest("GET", queryURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch registrations: %s", string(body))
	}

	var registrations []RegistrationWithEvent
	if err := json.Unmarshal(body, &registrations); err != nil {
		return nil, err
	}

	return registrations, nil
}

// createRegistration inserts a new registration into Supabase
func createRegistration(token, eventID, userID, notes string) (*Registration, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/registrations", supabaseClient.URL)

	payload := map[string]interface{}{
		"event_id": eventID,
		"user_id":  userID,
		"status":   "confirmed",
		"notes":    notes,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", queryURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Prefer", "return=representation")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to create registration: %s", string(body))
	}

	var registrations []Registration
	if err := json.Unmarshal(body, &registrations); err != nil {
		return nil, err
	}

	if len(registrations) == 0 {
		return nil, fmt.Errorf("registration created but no data returned")
	}

	return &registrations[0], nil
}

// cancelRegistration sets a registration's status to 'cancelled'
func cancelRegistration(token, registrationID, userID string) error {
	queryURL := fmt.Sprintf("%s/rest/v1/registrations?id=eq.%s&user_id=eq.%s",
		supabaseClient.URL, registrationID, userID)

	payload := map[string]interface{}{
		"status": "cancelled",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("PATCH", queryURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Prefer", "return=minimal")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to cancel registration: %s", string(body))
	}

	return nil
}

// getEventRegistrationCount returns the number of confirmed registrations for an event
func getEventRegistrationCount(eventID string) (int, error) {
	queryURL := fmt.Sprintf("%s/rest/v1/registrations?event_id=eq.%s&status=eq.confirmed&select=id",
		supabaseClient.URL, eventID)

	req, err := http.NewRequest("GET", queryURL, nil)
	if err != nil {
		return 0, err
	}

	req.Header.Set("apikey", supabaseClient.AnonKey)
	req.Header.Set("Authorization", "Bearer "+supabaseClient.AnonKey)
	req.Header.Set("Prefer", "count=exact")

	resp, err := supabaseClient.Client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("failed to get registration count: %s", string(body))
	}

	var registrations []map[string]interface{}
	if err := json.Unmarshal(body, &registrations); err != nil {
		return 0, err
	}

	return len(registrations), nil
}
