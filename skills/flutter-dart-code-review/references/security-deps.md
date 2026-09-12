# Flutter Review — Security e dependencies

## 9. Security

### Secure storage:
- [ ] Sensitive data (tokens, credentials) stored using platform-secure storage (Keychain on iOS, EncryptedSharedPreferences on Android)
- [ ] Never store secrets in plaintext storage
- [ ] Biometric authentication gating considered for sensitive operations

### API key handling:
- [ ] API keys NOT hardcoded in Dart source — use `--dart-define`, `.env` files excluded from VCS, or compile-time configuration
- [ ] Secrets not committed to git — check `.gitignore`
- [ ] Backend proxy used for truly secret keys (client should never hold server secrets)

### Input validation:
- [ ] All user input validated before sending to API
- [ ] Form validation uses proper validation patterns
- [ ] No raw SQL or string interpolation of user input
- [ ] Deep link URLs validated and sanitized before navigation

### Network security:
- [ ] HTTPS enforced for all API calls
- [ ] Certificate pinning considered for high-security apps
- [ ] Authentication tokens refreshed and expired properly
- [ ] No sensitive data logged or printed

## 10. Package/Dependency Review

### Evaluating pub.dev packages:
- [ ] Check **pub points score** (aim for 130+/160)
- [ ] Check **likes** and **popularity** as community signals
- [ ] Verify the publisher is **verified** on pub.dev
- [ ] Check last publish date — stale packages (>1 year) are a risk
- [ ] Review open issues and response time from maintainers
- [ ] Check license compatibility with your project
- [ ] Verify platform support covers your targets

### Version constraints:
- [ ] Use caret syntax (`^1.2.3`) for dependencies — allows compatible updates
- [ ] Pin exact versions only when absolutely necessary
- [ ] Run `flutter pub outdated` regularly to track stale dependencies
- [ ] No dependency overrides in production `pubspec.yaml` — only for temporary fixes with a comment/issue link
- [ ] Minimize transitive dependency count — each dependency is an attack surface

### Monorepo-specific (melos/workspace):
- [ ] Internal packages import only from public API — no `package:other/src/internal.dart` (breaks Dart package encapsulation)
- [ ] Internal package dependencies use workspace resolution, not hardcoded `path: ../../` relative strings
- [ ] All sub-packages share or inherit root `analysis_options.yaml`
