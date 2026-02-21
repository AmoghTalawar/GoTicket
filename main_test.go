package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

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

// RegisterRequest represents registration input
type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	Username    string `json:"username"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func main() {
	// Setup routes
	router := http.NewServeMux()
	router.HandleFunc("/", enableCORS(handleHome))
	router.HandleFunc("/api/register", enableCORS(handleRegister))
	router.HandleFunc("/api/login", enableCORS(handleLogin))
	router.HandleFunc("/api/profile", enableCORS(handleProfile))
	
	port := "8080"
	
	fmt.Printf("Server starting on port %s\n", port)
	fmt.Printf("TEST MODE: No Supabase integration\n")
	
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

// Handler functions

func handleHome(w http.ResponseWriter, r *http.Request) {
	sendJSON(w, http.StatusOK, map[string]interface{}{
		"message": "GoTicket API Server (TEST MODE)",
		"version": "1.0.0",
		"endpoints": []map[string]string{
			{"path": "/api/register", "method": "POST", "description": "User registration (TEST)"},
			{"path": "/api/login", "method": "POST", "description": "User authentication (TEST)"},
			{"path": "/api/profile", "method": "GET", "description": "User profile (TEST)"},
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
	
	// Create mock user (no Supabase)
	user := &User{
		ID:          fmt.Sprintf("mock-id-%d", time.Now().Unix()),
		Email:       req.Email,
		FullName:    req.FullName,
		PhoneNumber: req.PhoneNumber,
		Username:    req.Username,
		AccountType: "attendee",
		CreatedAt:   time.Now().Format("2006-01-02T15:04:05Z"),
	}
	
	// Generate mock JWT token
	token := fmt.Sprintf("mock-token-%s-%d", user.ID, time.Now().Unix())
	
	fmt.Printf("TEST MODE: Created user %s with email %s\n", user.ID, user.Email)
	
	sendJSON(w, http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   token,
		"message": "Registration successful (TEST MODE)",
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
	
	// Create mock user (no Supabase)
	user := &User{
		ID:          fmt.Sprintf("mock-id-%d", time.Now().Unix()),
		Email:       req.Email,
		FullName:    "Test User",
		PhoneNumber: "+1234567890",
		Username:    "testuser",
		AccountType: "attendee",
		CreatedAt:   time.Now().Format("2006-01-02T15:04:05Z"),
	}
	
	// Generate mock JWT token
	token := fmt.Sprintf("mock-token-%s-%d", user.ID, time.Now().Unix())
	
	fmt.Printf("TEST MODE: Logged in user %s with email %s\n", user.ID, user.Email)
	
	sendJSON(w, http.StatusOK, map[string]interface{}{
		"user":    user,
		"token":   token,
		"message": "Login successful (TEST MODE)",
	})
}

func handleProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, http.StatusMethodNotAllowed, "Method not allowed", "Only GET method is allowed")
		return
	}
	
	// Return mock profile
	user := &User{
		ID:          "mock-user-id",
		Email:       "test@example.com",
		FullName:    "Test User",
		PhoneNumber: "+1234567890",
		Username:    "testuser",
		AccountType: "attendee",
		CreatedAt:   time.Now().Format("2006-01-02T15:04:05Z"),
	}
	
	sendJSON(w, http.StatusOK, user)
}

// Helper functions

func validateRegistrationInput(req RegisterRequest) error {
	if req.Email == "" {
		return fmt.Errorf("email is required")
	}
	
	if req.Password == "" {
		return fmt.Errorf("password is required")
	}
	
	if len(req.Password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
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
	
	return nil
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
