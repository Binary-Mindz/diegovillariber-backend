# Client Developer Guide: Profile Name Format & Validation

This guide outlines the specifications and requirements for `profileName` (or `username`) across the Diego Motorsport platform.

---

## 📌 Summary of Changes

- **Uniqueness**: `profileName` is now **globally unique** in the database.
- **Format Requirements**: Profile names must follow a strict, professional format (lowercase, no spaces, allowed symbols).
- **Backend Normalization**: The backend automatically trims whitespace and converts uppercase letters to lowercase, but client apps should enforce this in the UI.

---

## 📏 Profile Name Rules

| Rule | Requirement | Example Valid | Example Invalid |
| :--- | :--- | :--- | :--- |
| **Length** | **3 to 30 characters** | `speed_99` | `ab` *(too short)*, `>30 chars` |
| **Allowed Characters** | Lowercase letters (`a-z`), numbers (`0-9`), `_`, `.`, `-` | `alex.racer` | `alex@racer`, `alex#1` |
| **Whitespace** | **No spaces or tabs allowed** | `john_doe` | `john doe` |
| **Start & End** | **Must start and end with `a-z` or `0-9`** | `driver_one` | `_driver`, `driver-` |
| **Consecutive Symbols** | **No consecutive symbols** (`..`, `__`, `--`, `._`) | `alex_speed.99` | `alex..speed`, `alex__99` |

---

## 💻 Regular Expression for Client-Side Validation

Use this regex in Flutter, React Native, iOS (Swift), Android (Kotlin), or Web:

```regex
^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$
```

### Code Snippets for Quick Integration

#### JavaScript / TypeScript / React Native
```typescript
export const isValidProfileName = (name: string): boolean => {
  const regex = /^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/;
  return regex.test(name.trim().toLowerCase());
};
```

#### Flutter / Dart
```dart
bool isValidProfileName(String name) {
  final regex = RegExp(r'^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$');
  return regex.hasMatch(name.trim().toLowerCase());
}
```

#### Kotlin (Android)
```kotlin
fun isValidProfileName(name: String): Boolean {
    val regex = Regex("^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$")
    return regex.matches(name.trim().lowercase())
}
```

#### Swift (iOS)
```swift
func isValidProfileName(_ name: String) -> Bool {
    let pattern = "^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$"
    return name.trimmingCharacters(in: .whitespaces).lowercased().range(of: pattern, options: .regularExpression) != nil
}
```

---

## 🔌 Affected Endpoints

| Method | Endpoint | Field Name | Required? |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | `username` | Required |
| `POST` | `/api/auth/google` | `username` | Optional *(auto-generated if omitted)* |
| `POST` | `/api/profiles` | `profileName` | Optional |
| `PATCH` | `/api/profiles/:profileId` | `profileName` | Optional |

---

## ⚠️ API Error Responses

### 1. Validation Error (`400 Bad Request`)
Occurs when the input does not match the required format or length:
```json
{
  "statusCode": 400,
  "message": [
    "Profile name must be 3-30 characters long, containing only lowercase letters, numbers, underscores (_), periods (.), or hyphens (-). It cannot start or end with a symbol, and cannot contain consecutive symbols or spaces."
  ],
  "error": "Bad Request"
}
```

### 2. Already Taken Error (`409 Conflict`)
Occurs when the profile name is already in use by another account:
```json
{
  "statusCode": 409,
  "message": "Profile name already exists",
  "error": "Conflict"
}
```

---

## 🎨 Recommended UI / UX Practices

1. **Auto-lowercase**: Automatically lowercase user input in the text field as they type.
2. **Prevent Spaces**: Intercept spacebar input to prevent trailing or internal spaces.
3. **Live Helper Text**: Show helper text indicating valid characters (`a-z`, `0-9`, `_`, `.`, `-`).
4. **Field-level Error Handling**: Highlight the field with `"This username is already taken"` upon receiving HTTP `409 Conflict`.
