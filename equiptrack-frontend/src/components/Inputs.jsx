export function Input({ label, ...props }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-gray-700 mb-1">{label}</span>
      <input {...props} className={'w-full border rounded-md px-3 py-2 outline-none focus:ring ' + (props.className || '')} />
    </label>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-gray-700 mb-1">{label}</span>
      <select {...props} className={'w-full border rounded-md px-3 py-2 outline-none focus:ring ' + (props.className || '')}>
        {children}
      </select>
    </label>
  )
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 mb-2">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
