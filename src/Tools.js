const initializeApplication = async () => {
  try {
    const response = await fetch(
      "https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/init"
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    console.log("Initialized sucessfully");
  } catch (e) {
    console.log("Unecpexted Error Occured", e);
  }
};
const loginRequestHandler = async (email, password) => {
  try {
    const response = await fetch(
      "https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    console.log("Initialized sucessfully");
    return response.json();
  } catch (e) {
    console.log("Unexpected Error Occured", e);
  }
};
const registerRequestHandler = async (email) => {
  try {
    const response = await fetch(
      "https://ghc-resource-hub-fmejafgthzhedxfm.eastus-01.azurewebsites.net/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    console.log("Initialized sucessfully");
  } catch (e) {
    console.log("Unecpexted Error Occured", e);
  }
};

export { initializeApplication, loginRequestHandler, registerRequestHandler };
