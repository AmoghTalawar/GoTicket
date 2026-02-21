# Go Installation Instructions for Windows

## Option 1: Install Go via Winget (Recommended)

Open PowerShell as Administrator and run:

```powershell
winget install GoLang.Go
```

Then restart PowerShell and verify:
```powershell
go version
```

## Option 2: Download and Install Manually

1. Download Go from: https://go.dev/dl/
2. Choose: `go1.22.windows-amd64.msi`
3. Run the installer and follow prompts
4. Restart PowerShell
5. Verify: `go version`

## Option 3: Use Chocolatey

If you have Chocolatey installed:
```powershell
choco install golang
```

## After Installation

1. **Restart PowerShell** (close and reopen)
2. **Verify installation**:
   ```powershell
   go version
   ```
   Should show: `go version go1.22.x windows/amd64`

3. **Run the backend**:
   ```powershell
   cd C:\Users\Lenovo\Downloads\go-ticket-organizer-dashboard
   $env:SUPABASE_URL="https://umyarehflskhhjkkvypd.supabase.co"
   $env:SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteWFyZWhmbHNraGhqa2t2eXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDQ2ODgsImV4cCI6MjA4NzE4MDY4OH0.8XA678Wq4OszO4-TmFHb7A08CHCHRmbPViKJgPYedGk"
   $env:PORT="8080"
   go run main.go
   ```

## Alternative: Use Node.js Backend

If you prefer not to install Go, I can create a Node.js/Express backend instead that works with your existing setup.

Would you like me to:
1. Create a Node.js backend (uses JavaScript, no new installation needed)
2. Or help you install Go?
