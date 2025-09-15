# MongoDB Models Documentation

This directory contains the MongoDB models for the XtraCarbon platform, designed to store user data, NGO project submissions, and verifier submissions.

## Models Overview

### 1. User Model (`User.ts`)
Stores user account information and authentication data.

**Key Features:**
- Integration with Clerk authentication
- Role-based access control (user, org, admin)
- User preferences and metadata
- Activity tracking (last login, creation date)

**Schema Fields:**
- `clerkId`: Unique Clerk user identifier
- `email`: User email address
- `firstName`, `lastName`: User names
- `role`: User role (user/org/admin)
- `organizationName`: Organization name (for org users)
- `contactPhone`: Contact information
- `profileImage`: Profile image URL
- `isActive`: Account status
- `preferences`: User preferences object
- `metadata`: Additional user data

**Indexes:**
- `clerkId` (unique)
- `email` (unique)
- `role`
- `isActive`
- `createdAt`

### 2. NGO Project Submission Model (`NGOProjectSubmission.ts`)
Stores comprehensive project submission data from NGOs and project developers.

**Key Features:**
- Support for three carbon credit types (Blue, Green, Yellow)
- Conditional data fields based on project type
- File upload support for evidence and documentation
- Status tracking throughout the verification process
- Location and monitoring data storage

**Schema Fields:**
- **Basic Info**: `projectName`, `organizationName`, `contactEmail`, `contactPhone`
- **Location**: `location` (lat/lng, address, country)
- **Area**: `landArea`, `landAreaUnit`
- **Project Type**: `projectType` (blue/green/yellow)
- **Monitoring**: `monitoringData` (dates, methods, frequency)
- **Type-specific Data**: `blueCarbonData`, `greenCarbonData`, `yellowCarbonData`
- **Evidence**: `fieldSurveyReports`, `additionalEvidence`
- **Status**: `submissionStatus`, `verificationStatus`
- **Review**: `reviewerId`, `reviewComments`, `reviewDate`
- **Credits**: `estimatedCarbonCredits`, `verifiedCarbonCredits`, `creditVintage`

**Indexes:**
- `submittedBy` + `submissionStatus`
- `projectType` + `submissionStatus`
- `submissionDate`
- `location.country`
- `verifierId` + `verificationStatus`

### 3. Verifier Submission Model (`VerifierSubmission.ts`)
Stores verification data and approval decisions from verifiers.

**Key Features:**
- Comprehensive verification checklist
- Approval/rejection workflow
- Carbon credit minting data
- Blockchain transaction tracking
- Verification methodology documentation

**Schema Fields:**
- **Project Reference**: `projectSubmissionId`, project details
- **Verifier Info**: `verifierId`, `verifierName`, `verifierOrganization`
- **Verification**: `verificationStatus`, `reviewComments`, `verificationMethodology`
- **Checklist**: `verificationChecklist` (5 boolean fields)
- **Approval**: `carbonCreditsToMint`, `blockchainTxId`, `creditVintage`
- **Additional**: `verificationNotes`, `standardsCompliance`, `riskAssessment`

**Indexes:**
- `projectSubmissionId`
- `verifierId` + `verificationStatus`
- `verificationStatus` + `verificationDate`
- `projectType` + `verificationStatus`

## Data Relationships

```
User (1) ──→ (N) NGOProjectSubmission
User (1) ──→ (N) VerifierSubmission
NGOProjectSubmission (1) ──→ (1) VerifierSubmission
```

## Usage Examples

### Creating a User
```typescript
import { UserService } from '@/lib/utils/database';

const user = await UserService.createUser({
  clerkId: 'user_123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
});
```

### Submitting an NGO Project
```typescript
import { NGOProjectService } from '@/lib/utils/database';

const submission = await NGOProjectService.createSubmission(formData, clerkUserId);
```

### Creating a Verifier Submission
```typescript
import { VerifierService } from '@/lib/utils/database';

const verification = await VerifierService.createVerification(
  formData, 
  verifierId, 
  projectSubmissionId
);
```

## Validation Schemas

All models include comprehensive Zod validation schemas in `lib/validations/schemas.ts`:

- `UserSchema`: User data validation
- `NGOProjectSubmissionSchema`: Project submission validation
- `VerifierSubmissionSchema`: Verification data validation
- `NGOFormSubmissionSchema`: Form input validation
- `VerifierFormSubmissionSchema`: Verifier form validation

## Database Connection

The MongoDB connection is managed through `lib/db/mongodb.ts`:

```typescript
import connectDB from '@/lib/db/mongodb';

// Ensure connection before operations
await connectDB();
```

## Environment Variables

Required environment variables in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/xtracarbon
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xtracarbon
```

## File Upload Handling

The models support file uploads through the `IFileUpload` interface:

```typescript
interface IFileUpload {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}
```

## Status Workflows

### NGO Project Submission Status Flow:
1. `draft` → `submitted` → `under_review` → `approved`/`rejected`
2. `requires_revision` (can go back to `submitted`)

### Verifier Submission Status Flow:
1. `pending` → `in_progress` → `approved`/`rejected`

## Best Practices

1. **Always validate data** using Zod schemas before saving
2. **Use transactions** for multi-document operations
3. **Index frequently queried fields** for performance
4. **Handle file uploads** through a separate service (e.g., Cloudinary)
5. **Use pagination** for large result sets
6. **Implement soft deletes** for data retention
7. **Add audit trails** for sensitive operations

## Performance Considerations

- Indexes are optimized for common query patterns
- Virtual fields provide computed properties without storage
- Aggregation pipelines for analytics and reporting
- Connection pooling through mongoose
- Query optimization with lean() for read-only operations

## Security Considerations

- Input validation with Zod schemas
- No sensitive data in logs
- Proper indexing to prevent injection
- Role-based access control
- File upload validation and sanitization
