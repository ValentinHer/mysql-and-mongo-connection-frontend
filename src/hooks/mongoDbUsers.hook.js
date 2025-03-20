export const createUser = async (formData) => {
  const result = await fetch("http://localhost:3000/mongodb/users", {
    method: "POST",
    body: formData,
  });

  if (!result.ok) {
    const res = await result.json();
    return { type: "error", message: res.message };
  }

  const res = await result.json();
  return { type: "success", message: res.message };
};

export const getUser = async (id) => {
  const result = await fetch(`http://localhost:3000/mongodb/users/${id}`, {
    method: "GET",
  });

  if (!result.ok) return result.json();

  return result.json();
};

export const getUsers = async () => {
  const result = await fetch("http://localhost:3000/mongodb/users", {
    method: "GET",
  });

  return result.json();
};

export const updateUser = async (formData, id) => {
  const result = await fetch(`http://localhost:3000/mongodb/users/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!result.ok) {
    const res = await result.json();
    return { type: "error", message: res.message };
  }

  const res = await result.json();
  return { type: "success", message: res.message };
};

export const deleteUser = async (id) => {
  const result = await fetch(`http://localhost:3000/mongodb/users/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    const res = await result.json();
    return { type: "error", message: res.message };
  }

  const res = await result.json();
  return { type: "success", message: res.message };
};
