$body = @{
    session_id = "test_session_123"
    messages = @(
        @{
            role = "user"
            content = "Hello, I have a headache"
        }
    )
} | ConvertTo-Json

Write-Host "Sending request to http://localhost:5000/api/chat"
Write-Host "Request body:"
Write-Host $body

try {
    $response = Invoke-WebRequest `
        -Uri "http://localhost:5000/api/chat" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing

    Write-Host "Success! HTTP Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content

} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Response.StatusCode
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host "Error Details:"
        Write-Host $_.ErrorDetails.Message
    }
}
