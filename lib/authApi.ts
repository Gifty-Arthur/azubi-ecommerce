// This is the shape of the data the server expects for registration
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// The URL now points to our local proxy for the users API
const REGISTER_API_URL = "/users-api/users";

/**
 * Sends user registration data to the server.
 * @param userData The user's name, email, and password.
 * @returns The JSON response from the server.
 */
export async function registerUser(userData: RegisterData) {
  try {
    const response = await fetch(REGISTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the server responded with an error code
    if (!response.ok) {
      // Try to parse the error message if the server sent one
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      } catch (jsonError) {
        // If the server's error response isn't JSON, use the status text
        throw new Error(response.statusText || 'An unknown error occurred');
      }
    }

    // If successful, return the server's response
    return await response.json();

  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

