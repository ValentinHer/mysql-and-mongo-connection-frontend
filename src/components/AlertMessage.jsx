function Alertmessage({message, alertType, }) {
  return (
    <div
      className={`fixed p-4 mb-4 inline-block inset-0 top-5 w-100 max-w-fit left-auto right-5 max-h-fit justify-center rounded-lg text-center text-sm break-words z-50 ${
        alertType === "success"
          ? "bg-green-200 text-green-800"
          : alertType === "error"
          ? "bg-red-200 text-red-800"
          : "bg-blue-200 text-blue-800"
      }`}
    >
      {message}
    </div>
  );
}

export default Alertmessage;
