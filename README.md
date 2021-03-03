# Whats involved in this demo project

-   unit tests
-   integration tests
-   documentation with jsdoc

# Notes about creating test user

### Make user

```
$ aws cognito-idp admin-create-user  --user-pool-id USERPOOLID  --username me@example.com --desired-delivery-mediums EMAIL --user-attributes Name=email,Value=me@example.com
```

### Enter temp password

Make sure `Enable username password based authentication (ALLOW_USER_PASSWORD_AUTH)` config is turned on. You can find this in the cognito console:

-   AppClients > ShowMore > AuthFlowsConfiguration

```
$ aws cognito-idp initiate-auth --client-id CLIENTID --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=me@example.com.me,PASSWORD="tempPassword"
```

### Submit real password

```
$ aws cognito-idp admin-respond-to-auth-challenge --user-pool-id USERPOOLID --client-id CLIENTID   --challenge-responses "NEW_PASSWORD=myPassword,USERNAME=me@example.com" --challenge-name NEW_PASSWORD_REQUIRED --session "YourLongSessionToken"
```
