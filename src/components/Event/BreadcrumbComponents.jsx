// Custom Breadcrumb Components - Mobile Responsive
export const Breadcrumb = ({ children, className = "" }) => (
  <nav className={`flex ${className}`} aria-label="Breadcrumb">
    {children}
  </nav>
);

export const BreadcrumbList = ({ children }) => (
  <ol className="flex items-center space-x-1 text-sm text-gray-600">
    {children}
  </ol>
);

export const BreadcrumbItem = ({ children }) => (
  <li className="flex items-center">{children}</li>
);

export const BreadcrumbPage = ({ children }) => (
  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
    {children}
  </span>
);

// Custom Separator Component
export const Separator = ({ orientation = "horizontal", className = "" }) => (
  <div
    className={`bg-gray-200 ${
      orientation === "vertical" ? "w-px h-3 sm:h-4" : "h-px w-full"
    } ${className}`}
  />
);
