// components/ui/input.jsx
function Input({ type = "text", placeholder, value, onChange, className = "" }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    )
  }
  
  export { Input }