// components/ui/button.jsx
function Button({ children, onClick, disabled, variant = "default", className = "" }) {
    const baseClasses = "px-4 py-2 rounded font-medium focus:outline-none transition-colors"
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
      outline: "border border-gray-300 hover:bg-gray-100 disabled:bg-gray-50",
      destructive: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
    }
  
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }
  
  export { Button }