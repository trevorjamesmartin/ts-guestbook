import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log({ error, errorInfo });
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1700);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <>
        <img alt="kitten" className="about-img" src="https://placekitten.com/50/50"></img>
        <h4>Something went wrong</h4>;
      </>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
