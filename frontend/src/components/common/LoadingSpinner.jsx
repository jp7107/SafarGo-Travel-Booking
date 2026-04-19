import "./LoadingSpinner.css";

function LoadingSpinner({ fullPage = false, size = "md", text = "" }) {
  const content = (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner">
        <div className="spinner-ring" />
        <span className="spinner-icon">✈️</span>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="spinner-fullpage">{content}</div>;
  }

  return content;
}

export default LoadingSpinner;
