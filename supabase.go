package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// SupabaseClient handles communication with Supabase
type SupabaseClient struct {
	URL    string
	AnonKey string
	ServiceKey string
}

// NewSupabaseClient creates a new Supabase client
func NewSupabaseClient(url, anonKey, serviceKey string) *SupabaseClient {
	return &SupabaseClient{
		URL:    url,
		AnonKey: anonKey,
		ServiceKey: serviceKey,
	}
}

// SignUp creates a new user in Supabase Auth
func (c *SupabaseClient) SignUp(email, password, username string) (*User, error) {
	url := fmt.Sprintf("%s/auth/v1/signup", c.URL)
	
	payload := map[string]interface{}{
		"email":    email,
		"password": password,
		"data": map[string]string{
			"username": username,
		},
	}
	
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", c.AnonKey)
	req.Header.Set("Authorization", "Bearer "+c.AnonKey)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("signup failed: %s", string(body))
	}
	
	var result struct {
		User User `json:"user"`
	}
	
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	
	return &result.User, nil
}

// SignIn authenticates a user
func (c *SupabaseClient) SignIn(email, password string) (*AuthResponse, error) {
	url := fmt.Sprintf("%s/auth/v1/token?grant_type=password", c.URL)
	
	payload := map[string]string{
		"email":    email,
		"password": password,
	}
	
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", c.AnonKey)
	req.Header.Set("Authorization", "Bearer "+c.AnonKey)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("signin failed: %s", string(body))
	}
	
	var result struct {
		User  User  `json:"user"`
		Token string `json:"access_token"`
	}
	
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	
	return &AuthResponse{
		User:  result.User,
		Token: result.Token,
	}, nil
}

// GetUser retrieves user profile by ID
func (c *SupabaseClient) GetUser(userID, token string) (*User, error) {
	url := fmt.Sprintf("%s/auth/v1/user", c.URL)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("apikey", c.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("get user failed: %s", string(body))
	}
	
	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		return nil, err
	}
	
	return &user, nil
}

// UpdateUserProfile updates user metadata
func (c *SupabaseClient) UpdateUserProfile(userID, token, username string) (*User, error) {
	url := fmt.Sprintf("%s/auth/v1/user", c.URL)
	
	payload := map[string]interface{}{
		"data": map[string]string{
			"username": username,
		},
	}
	
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	
	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", c.AnonKey)
	req.Header.Set("Authorization", "Bearer "+token)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("update user failed: %s", string(body))
	}
	
	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		return nil, err
	}
	
	return &user, nil
}

// Global Supabase client
var supabaseClient *SupabaseClient

// Initialize Supabase client
func initSupabaseClient() {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseAnonKey := os.Getenv("SUPABASE_ANON_KEY")
	supabaseServiceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	
	if supabaseURL == "" || supabaseAnonKey == "" {
		panic("SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
	}
	
	supabaseClient = NewSupabaseClient(supabaseURL, supabaseAnonKey, supabaseServiceKey)
}
