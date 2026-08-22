# Vidu S1 Error Codes Reference

---

## HTTP Status Codes

| Code | Reason | Typical Cause | Client Handling |
|---|---|---|---|
| 400 | BAD_REQUEST | Invalid params, missing fields, invalid call_mode, text too long, session state doesn't permit operation | Fix request per field descriptions; if session ended, create new |
| 401 | Unauthorized | API key missing, malformed, or invalid | Check `Authorization: Token vda_xxx` |
| 403 | Forbidden | Live session doesn't belong to current API key/account | Use same API key that created session |
| 404 | Not Found | Session doesn't exist, expired, or wrong live_id | Confirm live_id; create new if unrecoverable |
| 500 | Internal Server Error | DB, SIP/video provider, AliRTC token service failed | Retry after short delay; if persistent, provide live_id, trace_id, request time |

---

## WebSocket Business Errors (conn_init_ack)

| Error Code | Message | Cause | Handling |
|---|---|---|---|
| NOT_READY | "live sip endpoint not ready" | Digital character rendering service hasn't completed callback connection | Wait 2-3s, retry conn_init; exponential backoff recommended |
| LIVE_CONN_INIT_FAILED | "connection initialization failed" | Abnormal session state or server-side dependency failure | Close WS, create new Live session; if still fails, provide live_id + logs |

---

## Hangup Reasons (call_hangup / force_hangup)

| hangup_reason | Scenario |
|---|---|
| user_end | User actively ends session |
| timeout | Session reached max duration (live_duration) |
| audit_violation | Content safety/policy triggered |
| credit_insufficient | Insufficient credits |
| sip_closed / provider_closed | Service or SIP provider closed |
| sip_reconnect_timeout / client_reconnect_timeout | Disconnection exceeded reconnection grace period |
| external | Closed by backend/external control |

---

## AliRTC Errors (Common)

| Error | Cause | Handling |
|---|---|---|
| JOIN_CHANNEL_FAILED | Token expired, invalid, or network | Verify token_expire_at, refresh if needed |
| PUBLISH_FAILED | Camera/mic permission denied | Request media permissions |
| SUBSCRIBE_FAILED | Remote stream not available | Check remote user is online, retry |

---

## Memory/Knowledge Retrieval Errors

| Error | Cause | Handling |
|---|---|---|
| RETRIEVAL_TIMEOUT | External API > timeout_ms (max 30000) | Increase timeout, optimize external API |
| RETRIEVAL_EMPTY | No results found | Return empty array; not an error |
| AUTH_FAILED | External API returns 401/403 | Check authorization header in config |
| INVALID_RESPONSE | External API returns non-JSON or wrong schema | Validate response format per spec |