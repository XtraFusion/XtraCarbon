# MongoDB Setup Guide for XtraCarbon

This guide will help you set up MongoDB for the XtraCarbon platform with all the necessary models for storing user data, NGO form submissions, and verifier form submissions.

## Prerequisites

1. **MongoDB Installation**
   - Local MongoDB installation, or
   - MongoDB Atlas account (recommended for production)

2. **Node.js Dependencies**
   ```bash
   npm install mongoose
   ```

## Environment Setup

1. **Create `.env.local` file** in your project root:
   ```env
   MONGODB_URI=mongodb://localhost:27017/xtracarbon
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xtracarbon
   ```

2. **Install MongoDB dependencies** (if not already installed):
   ```bash
   npm install mongoose
   ```

## Database Models Created

### 1. User Model (`lib/models/User.ts`)
- **Purpose**: Store user account information and authentication data
- **Key Features**:
  - Clerk authentication integration
  - Role-based access (user, org, admin)
  - User preferences and metadata
  - Activity tracking

### 2. NGO Project Submission Model (`lib/models/NGOProjectSubmission.ts`)
- **Purpose**: Store comprehensive project submission data from NGOs
- **Key Features**:
  - Support for Blue, Green, and Yellow carbon credit types
  - Conditional data fields based on project type
  - File upload support for evidence
  - Status tracking throughout verification process
  - Location and monitoring data storage

### 3. Verifier Submission Model (`lib/models/VerifierSubmission.ts`)
- **Purpose**: Store verification data and approval decisions
- **Key Features**:
  - Comprehensive verification checklist
  - Approval/rejection workflow
  - Carbon credit minting data
  - Blockchain transaction tracking

## File Structure

```
lib/
├── models/
│   ├── User.ts                    # User model
│   ├── NGOProjectSubmission.ts    # NGO project submission model
│   ├── VerifierSubmission.ts      # Verifier submission model
│   ├── index.ts                   # Model exports
│   └── README.md                  # Detailed model documentation
├── db/
│   └── mongodb.ts                 # Database connection
├── types/
│   └── index.ts                   # TypeScript interfaces
├── validations/
│   └── schemas.ts                 # Zod validation schemas
└── utils/
    └── database.ts                # Database service classes
```

## API Routes Created

### Projects API (`app/api/projects/route.ts`)
- `GET /api/projects` - Fetch projects with filtering and pagination
- `POST /api/projects` - Create new project submission

### Verifications API (`app/api/verifications/route.ts`)
- `GET /api/verifications` - Fetch verifications for a verifier
- `POST /api/verifications` - Create new verification

### Dashboard API (`app/api/dashboard/stats/route.ts`)
- `GET /api/dashboard/stats` - Get dashboard statistics

## Usage Examples

### 1. Creating a User
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

### 2. Submitting an NGO Project
```typescript
import { NGOProjectService } from '@/lib/utils/database';

const submission = await NGOProjectService.createSubmission(formData, clerkUserId);
```

### 3. Creating a Verifier Submission
```typescript
import { VerifierService } from '@/lib/utils/database';

const verification = await VerifierService.createVerification(
  formData, 
  verifierId, 
  projectSubmissionId
);
```

## Data Relationships

```
User (1) ──→ (N) NGOProjectSubmission
User (1) ──→ (N) VerifierSubmission
NGOProjectSubmission (1) ──→ (1) VerifierSubmission
```

## Status Workflows

### NGO Project Submission Status Flow:
1. `draft` → `submitted` → `under_review` → `approved`/`rejected`
2. `requires_revision` (can go back to `submitted`)

### Verifier Submission Status Flow:
1. `pending` → `in_progress` → `approved`/`rejected`

## Key Features

### 1. Comprehensive Validation
- Zod schemas for all data validation
- Type-safe interfaces for all models
- Input sanitization and validation

### 2. Performance Optimization
- Strategic indexing for common queries
- Pagination support for large datasets
- Aggregation pipelines for analytics

### 3. Security
- Input validation with Zod
- Role-based access control
- Secure file upload handling

### 4. Scalability
- Connection pooling
- Efficient query patterns
- Modular service architecture

## Testing the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test API endpoints**:
   ```bash
   # Get dashboard stats
   curl http://localhost:3000/api/dashboard/stats
   
   # Get projects
   curl http://localhost:3000/api/projects
   ```

3. **Check MongoDB connection**:
   - Verify connection in MongoDB Compass or Atlas
   - Check that collections are created automatically

## Production Considerations

1. **Use MongoDB Atlas** for production
2. **Set up proper indexes** for your query patterns
3. **Implement backup strategies**
4. **Monitor performance** and optimize queries
5. **Use connection pooling** for high-traffic applications

## Troubleshooting

### Common Issues:

1. **Connection Errors**:
   - Check MONGODB_URI environment variable
   - Verify MongoDB is running
   - Check network connectivity (for Atlas)

2. **Validation Errors**:
   - Ensure all required fields are provided
   - Check data types match schema requirements
   - Verify enum values are correct

3. **Performance Issues**:
   - Add appropriate indexes
   - Use pagination for large datasets
   - Optimize queries with lean() for read operations

## Next Steps

1. **Integrate with your forms**: Update the NGO and Verifier forms to use these APIs
2. **Add file upload**: Implement file upload handling (Cloudinary, AWS S3, etc.)
3. **Add authentication**: Ensure proper role-based access control
4. **Add monitoring**: Set up logging and error tracking
5. **Add tests**: Create unit and integration tests for the models

## Support

For questions or issues:
1. Check the model documentation in `lib/models/README.md`
2. Review the validation schemas in `lib/validations/schemas.ts`
3. Test with the provided API examples
4. Check MongoDB logs for connection issues
