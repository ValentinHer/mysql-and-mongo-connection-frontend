export const createMysqlUser = async (formData) => {
  const result = await fetch("http://localhost:3000/mysql/users", {
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

export const getMysqlUser = async (id) => {
  const result = await fetch(`http://localhost:3000/mysql/users/${id}`, {
    method: "GET",
  });

  if (!result.ok) return result.json();

  return result.json();
};

export const getMysqlUsers = async () => {
  const result = await fetch("http://localhost:3000/mysql/users", {
    method: "GET",
  });

  return result.json();
};

export const updateMysqlUser = async (formData, id) => {
  const result = await fetch(`http://localhost:3000/mysql/users/${id}`, {
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

export const deleteMysqlUser = async (id) => {
  const result = await fetch(`http://localhost:3000/mysql/users/${id}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    const res = await result.json();
    return { type: "error", message: res.message };
  }

  const res = await result.json();
  return { type: "success", message: res.message };
};
