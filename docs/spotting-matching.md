# Spotting Matching Mechanism for Frontend Developers

This document explains how the backend decides when a spotting request should match a post.

## 1. What the frontend sends

When creating a spotting request, the frontend should send a payload similar to this:

```json
{
  "vehicleType": "CAR",
  "brand": "BMW",
  "model": "M3",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "radiusKm": 100,
  "profileId": "optional-profile-id",
  "carId": "optional-car-id"
}
```

### Important fields

- `vehicleType`: optional, used to filter by vehicle category.
- `brand`: optional, main search keyword.
- `model`: optional, secondary search keyword.
- `latitude` and `longitude`: required for distance matching.
- `radiusKm`: optional, default is `100` km.
- `carId` and `profileId`: optional identifiers for ownership validation.

> The request no longer accepts a separate `hashtags` list from the frontend.

## 2. When matching happens

The backend runs matching automatically in two places:

1. When a spotting request is created.
2. When a new post is created.

This means the frontend does not need to trigger matching manually.

## 3. Matching rules

A post is considered a match when all of the following conditions are true:

### A. Same vehicle category

- If the request has a `vehicleType`, the post must match that category.
- If the request does not provide a vehicle type, the backend will still evaluate the post based on the other rules.

### B. Brand/model similarity

- Matching is case-insensitive.
- Matching is partial and flexible.
- Examples:
  - request brand `BMW` matches post brand `bmw`
  - request model `M3` matches post model `M3 Competition`
  - request brand `Lambo` can match a post brand that contains `Lamborghini`

### C. Hashtags as supporting signals

- The backend also checks post hashtags.
- This is not a separate input field from the frontend.
- The request’s `brand` and `model` values are used as the search terms, and if those terms appear in the post’s hashtags, that helps the match score.

### D. Distance filter

- The post must be within the request’s `radiusKm` from the request location.

### E. Exclusions

- The backend will not match:
  - a post created by the same user
  - posts from users blocked by either side
  - duplicate matches that already exist

## 4. What frontend should expect

After a request is created, the backend will automatically create matches and store them.

Frontend can read them from:

- `GET /spotting-requests/my`
- `GET /spotting-requests/:id/matches`

## 5. UX recommendations

To get better matching results, the frontend should encourage users to provide:

- a clear `brand`
- a clear `model`
- a reasonable radius
- accurate location coordinates

## 6. Example behavior

If the frontend sends:

- `brand: "BMW"`
- `model: "M3"`
- `radiusKm: 100`

Then a post may match if it has:

- a car brand/model like `BMW` and `M3 Competition`, or
- hashtags containing `bmw` or `m3`, and
- a location within the configured radius.
