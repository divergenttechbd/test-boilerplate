import { registerAs } from '@nestjs/config';

/**
 * Swagger configuration
 * -----------------------------------------------
 * This configuration handles the integration of Swagger (OpenAPI) documentation
 * with the application. It is flexible and works across different environments.
 * Features include automatic route detection, authentication, permissions, 
 * validation schema extraction, and more.
 */
export default registerAs('swagger', () => ({
  /**
   * Enable or disable Swagger documentation generation.
   * Default is enabled for non-production environments.
   */
  enabled: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',

  /**
   * API documentation title
   * Can be set in `.env` for flexibility.
   */
  title: process.env.SWAGGER_TITLE || 'My API',

  /**
   * API description for Swagger UI
   * Describes the purpose and functionality of the API.
   */
  description: process.env.SWAGGER_DESCRIPTION || 'API documentation for the application.',

  /**
   * API version for Swagger documentation.
   * Can be updated automatically in the future.
   */
  version: process.env.SWAGGER_VERSION || '1.0.0',

  /**
   * Path to access the Swagger documentation (URL endpoint).
   * Default is '/docs' but can be customized.
   */
  path: process.env.SWAGGER_PATH || '/docs',

  /**
   * Whether to expose the Swagger documentation with authentication.
   * If true, allows a user to manually add their bearer token.
   */
  authEnabled: process.env.SWAGGER_AUTH_ENABLED === 'true',

  /**
   * Configuration for Bearer token in Swagger UI
   * Supports JWT or other token types.
   */
  bearer: {
    name: process.env.SWAGGER_BEARER_NAME || 'Authorization', // Header name
    type: process.env.SWAGGER_BEARER_TYPE || 'http',           // Token type
    scheme: process.env.SWAGGER_BEARER_SCHEME || 'bearer',    // Token scheme
    bearerFormat: process.env.SWAGGER_BEARER_FORMAT || 'JWT',  // Format of the token
  },

  /**
   * Enable detection of permission metadata from guards.
   * Automatically retrieves permissions and attaches them to Swagger docs.
   */
  detectPermissions: process.env.SWAGGER_DETECT_PERMISSIONS === 'true',

  /**
   * Enable auto-generation of validation rules for DTOs using class-validator.
   * Can automatically generate schema based on DTO validations (e.g., @IsString(), @IsInt() etc.).
   */
  autoGenerateValidationSchema: process.env.SWAGGER_AUTO_GENERATE_VALIDATION === 'true',

  /**
   * Automatically detect API request and response examples.
   * Useful for displaying sample inputs and outputs in the Swagger UI.
   */
  showExamples: process.env.SWAGGER_SHOW_EXAMPLES !== 'false',

  /**
   * Enable response status examples (e.g., Success/Failure).
   * Provides demo response bodies for various HTTP statuses.
   */
  showResponseExamples: process.env.SWAGGER_SHOW_RESPONSE_EXAMPLES !== 'false',

  /**
   * Add API route information to the documentation dynamically.
   * Routes can be auto-detected without the need for decorators.
   */
  autoDetectRoutes: process.env.SWAGGER_AUTO_DETECT_ROUTES === 'true',

  /**
   * Specify whether to include validation messages for each API endpoint.
   * The validation rules defined in DTOs will be shown without needing to specify `@ApiProperty`.
   */
  showValidationMessages: process.env.SWAGGER_SHOW_VALIDATION_MESSAGES !== 'false',
}));






/*
Swagger setup expectations are crystal clear and very advanced. You're aiming for automation and zero duplication, which is excellent from a developer productivity, code maintainability, and documentation quality perspective.
Let’s walk through your points to clarify capabilities, feasibility, and required effort for each one before I implement the swagger.config.ts and setup module.

🔍 Requirements Clarification

#	Requirement 	                Clarification & Feasibility
1	Disable in production   	    ✅ 100% doable via process.env.NODE_ENV check
2	Auto-detect route names 	    ✅ Route names are auto-extracted via @nestjs/swagger + built-in scanner
3	Auto-detect auth/guard use	    🟡 Partially doable: Requires scanning metadata on route handlers and classes. Can use Reflector and metadataKeys
4	Auto-detect permission guards	🟡 Feasible if all permissions are added using a standard metadata key (e.g., Reflect.defineMetadata('permissions', ...)) in guards
5	Auto-detect validation rules from DTOs (without @ApiProperty)	🔴 Not natively supported, but ✅ achievable using custom Swagger plugin or tools like class-validator-jsonschema
6	Success/Failure response demo	✅ With @nestjs/swagger, we can auto-register status codes and wrap responses using interceptors or decorators (e.g., @ApiOkResponse, @ApiBadRequestResponse) OR manually for now with extension

🧠 Summary

Feature	        Native NestJS Swagger Support	        Extra Work Needed
Disable in prod	                    ✅ Yes	                        ❌ No
Auto route detection	            ✅ Yes	                        ❌ No
Detect auth guards	                🟡 Partial	                    ✅ Yes
Detect permission metadata	        🟡 Partial	                    ✅ Yes
DTO validation introspection	    🔴 No	                        ✅ Yes (plugin)
Success/Failure response formats	✅ Yes (with decorators)	        Optional tweaks

🔧 Suggestions
For DTO validation rule detection, I can integrate with:
- class-validator + class-transformer
- Plugin like class-validator-jsonschema
- Then use the schema to generate OpenAPI definitions without needing @ApiProperty.
- For auth/permissions, we can:
- Standardize guards to set metadata (e.g., using Reflect.defineMetadata('permissions', PERMISSION, target))
- Use global scan logic to read this metadata and annotate Swagger docs dynamically.




🎯 Key Features and Use Cases

Feature	                                        Description
enabled	                         Controls whether Swagger is enabled in production or testing environments. Useful for controlling access to docs.
title, description, version	        Customizable metadata to provide detailed API information. Essential for understanding the purpose of the API.
authEnabled + bearer config	    Configures how authentication is handled in Swagger UI (supports JWT and other token-based schemes). Allows for testing secured endpoints.
detectPermissions	            Enables the automatic detection of permissions associated with each route, pulling them from guards. This adds an extra layer of security and visibility in docs.
autoGenerateValidationSchema	Automatically generates validation schemas based on DTO validation rules (like @IsString, @IsInt, etc.) without needing to manually add @ApiProperty decorators.
showExamples	                Provides real-world examples for API requests and responses, improving documentation accessibility and usability.
showResponseExamples	        Ensures that success/failure response status examples are automatically included for each route. Useful for showing expected output.
autoDetectRoutes	        Automatically detects all API routes and populates the Swagger documentation without needing to manually decorate each route with @ApiOperation, @ApiResponse, etc.
showValidationMessages	    Controls whether the validation error messages (from class-validator) will be included in the Swagger UI for each endpoint, ensuring clear understanding of validation rules.



bootstrap swagger integration (src/bootstrap/swagger.bootstrap.ts) which:
- Initializes Swagger only when enabled,
- Optionally uses plugin for class-validator,
- Adds bearer auth,
- Optionally includes dynamic permission metadata





*/