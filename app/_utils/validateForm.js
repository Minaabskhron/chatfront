export const validateField = (fieldName, value, formData) => {
  switch (fieldName) {
    case "name":
      if (!value.trim()) return "Name is required";
      break;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!value.includes("@")) return "Email must be valid";
      break;
    case "username":
      if (!value.trim()) return "username is required";
      break;
    case "password":
      if (!value.trim()) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      break;
    case "rePassword":
      if (!value.trim()) return "Please confirm password";
      if (value !== formData.password) return "Passwords must match";
      break;
    case "city":
      if (!value.trim()) return "city is required";
      break;
    case "details":
      if (!value.trim()) return "details is required";
      break;
    default:
      return "";
  }
  return "";
};
