package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// TokenRequest is the JSON payload sent to Lightspeed token endpoint
type TokenRequest struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	GrantType    string `json:"grant_type"`
	Code         string `json:"code"`
	RedirectURI  string `json:"redirect_uri"`
}

// TokenResponse represents the JSON response from Lightspeed
type TokenResponse map[string]interface{}

func callbackHandler(w http.ResponseWriter, r *http.Request) {
	// Get query params
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	log.Println("Received OAuth callback, state:", state)

	if code == "" {
		http.Error(w, `{"error":"Missing code"}`, http.StatusBadRequest)
		return
	}

	// Prepare the request body to exchange the code for tokens
tokenReq := TokenRequest{
	ClientID:     os.Getenv("LIGHTSPEED_CLIENT_ID"),
	ClientSecret: os.Getenv("LIGHTSPEED_CLIENT_SECRET"),
	GrantType:    "authorization_code",
	Code:         code,
	RedirectURI:  "https://localhost:3000/api/callback", // must exactly match what you used in initial auth
}

	reqBody, err := json.Marshal(tokenReq)
	if err != nil {
		http.Error(w, `{"error":"Failed to marshal request"}`, http.StatusInternalServerError)
		return
	}

	// POST request to Lightspeed token endpoint
	resp, err := http.Post("https://cloud.lightspeedapp.com/auth/oauth/token", "application/json", bytes.NewReader(reqBody))
	if err != nil {
		http.Error(w, `{"error":"Failed to request token"}`, http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, `{"error":"Failed to read token response"}`, http.StatusInternalServerError)
		return
	}

	// If Lightspeed returns an error, forward that status
	if resp.StatusCode != http.StatusOK {
		w.WriteHeader(resp.StatusCode)
		w.Header().Set("Content-Type", "application/json")
		w.Write(bodyBytes)
		return
	}

	// Parse JSON response to pretty-print it
	var tokenData TokenResponse
	if err := json.Unmarshal(bodyBytes, &tokenData); err != nil {
		http.Error(w, `{"error":"Failed to parse token response"}`, http.StatusInternalServerError)
		return
	}

	// Log the access token (be careful with logs in production!)
	if accessToken, ok := tokenData["access_token"]; ok {
		log.Println("🔑 Access Token:", accessToken)
	}

	// Send JSON response back to client
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tokenData)
}

func main() {
	// Load .env file (optional)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	http.HandleFunc("/api/callback", callbackHandler)

	certFile := "localhost.pem"
	keyFile := "localhost-key.pem"

	fmt.Println("Starting HTTPS server at https://localhost:3000")
	err := http.ListenAndServeTLS(":3000", certFile, keyFile, nil)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
