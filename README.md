# EHR Mapping System - Frontend

A comprehensive frontend application for managing EHR (Electronic Health Record) mappings and patient data integration. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes and components
- User profile management

### 🗺️ EHR Mapping Management
- Create, read, update, and delete EHR mappings
- Support for multiple EHR systems (Athena, Allscripts, Epic, Cerner)
- Field type mapping and data type validation
- Active/inactive status management
- Real-time mapping updates

### 🌍 Multi-Language Support
- English, Spanish, French, and German support
- Dynamic language switching
- Localized UI components and messages
- Persistent language preferences

### 📊 Patient Data Mapping
- Interactive patient data mapper
- Real-time EHR system integration testing
- Support for various data types (string, number, boolean, date, array, object)
- Language-specific field mapping

### 🔄 Bulk Operations
- Bulk update multiple mappings
- CSV import/export functionality
- Batch processing with progress indicators
- Admin-only bulk operations

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/light theme support
- Interactive components with Heroicons
- Loading states and error handling
- Toast notifications

### 🛡️ Error Handling & Validation
- Comprehensive error boundaries
- Form validation with Zod schemas
- API error handling and retry logic
- User-friendly error messages

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3001

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ehr.mappingweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Environment
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Integration

The frontend expects the backend API to be running on `http://localhost:3001` with the following endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

#### EHR Mappings
- `GET /ehr-mappings` - Get all mappings
- `GET /ehr-mappings/systems` - Get available EHR systems
- `GET /ehr-mappings/:ehrSystem` - Get mappings by system
- `POST /ehr-mappings` - Create new mapping
- `PUT /ehr-mappings/:id` - Update mapping
- `POST /ehr-mappings/bulk-update/:ehrSystem` - Bulk update mappings
- `POST /ehr-mappings/map-patient-data` - Map patient data

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard
│   └── login/             # Authentication pages
├── components/            # Reusable UI components
│   ├── EhrMappingManager.tsx
│   ├── PatientDataMapper.tsx
│   ├── BulkOperationsPanel.tsx
│   ├── MappingFormModal.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── LanguageSelector.tsx
│   ├── ErrorBoundary.tsx
│   └── ProtectedRoute.tsx
├── contexts/              # React Context providers
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   └── LanguageContext.tsx
├── lib/                   # Utility libraries
│   └── api.ts            # API client
└── config/               # Configuration files
    └── api.ts            # API configuration
```

## Key Components

### Authentication System
- **AuthContext**: Manages user authentication state
- **LoginForm/RegisterForm**: User authentication forms
- **ProtectedRoute**: Route protection wrapper
- **JWT token management**: Automatic token refresh and storage

### EHR Mapping Management
- **EhrMappingManager**: Main mapping management interface
- **MappingFormModal**: Create/edit mapping forms
- **BulkOperationsPanel**: Bulk operations interface
- **Real-time updates**: Live mapping status changes

### Patient Data Integration
- **PatientDataMapper**: Interactive data mapping tool
- **Multi-language support**: Language-specific field mapping
- **Data validation**: Type-safe data transformation

### Error Handling
- **ErrorBoundary**: Global error catching
- **NotificationContext**: Toast notification system
- **Form validation**: Zod schema validation
- **API error handling**: Comprehensive error management

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# With Turbopack (faster builds)
npm run dev --turbopack
npm run build --turbopack
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for quality checks (if configured)

### Testing

```bash
# Run tests (if configured)
npm test
npm run test:watch
npm run test:coverage
```

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

For production deployment, set the following environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Integration

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests
5. Automatic token refresh on expiration

### Data Flow

1. **Load EHR Systems**: Fetch available EHR systems
2. **Load Mappings**: Get mappings for selected system/language
3. **Create/Update**: Form validation and API calls
4. **Real-time Updates**: Optimistic updates with rollback
5. **Error Handling**: User-friendly error messages

### Multi-Language Support

1. **Language Context**: Global language state management
2. **Translation Keys**: Structured translation system
3. **Dynamic Switching**: Real-time language changes
4. **Persistent Storage**: Language preference saved

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Admin/User permission system
- **Input Validation**: Zod schema validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Next.js protection
- **Secure Headers**: Security headers configuration

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This frontend application requires the corresponding backend API to be running for full functionality. Make sure the backend is properly configured and accessible before starting the frontend development server.