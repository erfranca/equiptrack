export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className={'px-4 py-2 rounded-md bg-gray-900 text-white hover:opacity-90 ' + (props.className || '')}
    >
      {children}
    </button>
  )
}
