---
'@keystonejs/api-tests': patch
'@keystonejs/fields': patch
---

Fixed a bug on `MongooseAdapter` where `DateTime` fields did not respect the `isUnique` flag. Added more tests to prevent regressions of this bug.
