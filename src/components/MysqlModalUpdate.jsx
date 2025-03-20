import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  Calendar,
  FileText,
  AlertCircle,
  SquarePen,
} from "lucide-react";
import { updateMysqlUser } from "../hooks/mysqlUsers.hook";
import Alertmessage from "./AlertMessage";
// import { updateUser } from "../hooks/mongoDbUsers.hook";

// Zod schema for form validation
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 carácteres")
      .max(50, "El nombre debe tener menos de 50 carácteres")
      .regex(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        "El nombre solo debe contener letras y espacios"
      )
      .refine(
        (val) => {
          const newValue = val.trim();
          return newValue === val;
        },
        {
          message: "El nombre no debe contener espacios al principio o final",
        }
      )
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 carácteres")
      .regex(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra en mayúscula"
      )
      .regex(
        /[a-z]/,
        "La contraseña debe contener al menos una letra en minúscula"
      )
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .refine(
        (val) => {
          const newValue = val.replace(/\s+/g, "");
          return newValue === val;
        },
        {
          message: "La contraseña no debe contener espacios",
        }
      )
      .optional()
      .or(z.literal("")),
    passwordConfirmation: z.string(),
    date_signup: z
      .string()
      .refine(
        (date) => new Date(date) <= new Date(),
        "La fecha no puede ser futura"
      )
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .min(10, "La descripción debe tener al menos 10 carácteres")
      .max(500, "La descripción debe tener menos de 500 carácteres")
      .refine(
        (val) => {
          const newValue = val.trim();
          return newValue === val;
        },
        {
          message:
            "La descripción no debe contener espacios al principio o final",
        }
      )
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

function MysqlModal({ closeModal, user, botonActive }) {
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [botonMysqlActive, setBotonMysqlActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: user.name,
      password: "",
      date_signup: new Date(user.date_signup).toISOString().split("T")[0],
      description: user.description,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = async (data) => {
    const { passwordConfirmation, password, name, date_signup, description } =
      data;
    const formdata = new FormData();

    if (name && name != user.name) {
      formdata.append("name", name);
    }

    if (password) {
      formdata.append("password", password);
    }

    if (
      date_signup &&
      new Date(date_signup).toISOString() !=
        new Date(user.date_signup).toISOString()
    ) {
      formdata.append("date_signup", date_signup);
    }

    if (description && description != user.description) {
      formdata.append("description", description);
    }

    if (file) {
      formdata.append("file", file);
    }

    if ([...formdata.entries()].length > 0) {
      const result = await updateMysqlUser(formdata, user.id_user);
      setBotonMysqlActive(true);

      if (result.type === "error") {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => setAlertMessage(""), 3000);
        setBotonMysqlActive(false);
      } else {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => {
          setAlertMessage("");
          closeModal();
          reset();
          setImagePreview("");
          window.location.reload();
        }, 3000);
      }
    } else {
      setAlertMessage("Ingresa los datos a actualizar");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const renderError = (error) => (
    <p className="mt-1 text-sm text-red-600 flex items-center">
      <AlertCircle className="w-4 h-4 mr-1" />
      {error}
    </p>
  );

  return (
    <div className="fixed max-w-md md:max-w-xl mx-auto bg-white rounded-xl shadow-lg inset-0 my-auto z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-neutral-500/50 bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      <div className="px-6 py-6 relative max-w-md md:max-w-xl mx-auto bg-white rounded-xl shadow-lg my-10 overflow-y-auto z-50 p-6">

        {alertMessage && (
          <Alertmessage alertType={alertType} message={alertMessage} />
        )}

        <div className="flex justify-center relative mb-4">
          <img
            src={imagePreview ? imagePreview : user.image_url}
            className="w-32 h-32 object-cover rounded-full bg-gray-300 static"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
            className=" hidden"
          />
          <label
            htmlFor="image-upload"
            className="flex justify-center items-center bg-neutral-950 w-7 h-7 rounded-full absolute bottom-3 right-50 hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            <SquarePen className="w-4 h-4" color="white" />
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="block mb-0 md:flex md:mb-4 gap-x-4">
            {/* Name Field */}
            <div className="w-full md:w-70 mb-3 md:mb-0">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 mr-2" />
                Nombre
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingresa tu nombre"
              />
              {errors.name && renderError(errors.name.message)}
            </div>

            {/* Date Signup Field */}
            <div className="w-full md:w-70 mb-3 md:mb-0">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Fecha
              </label>
              <input
                type="date"
                {...register("date_signup")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.date_signup ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.date_signup && renderError(errors.date_signup.message)}
            </div>
          </div>

          <div className="block mb-0 md:flex md:mb-4 gap-x-4">
            {/* Password Field */}
            <div className="w-full md:w-70 mb-3 md:mb-0">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 mr-2" />
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && renderError(errors.password.message)}
            </div>

            {/* Password Confirmation Field */}
            <div className="w-full md:w-70 mb-3 md:mb-0">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 mr-2" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                {...register("passwordConfirmation")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Confirma tu contraseña"
              />
              {errors.passwordConfirmation &&
                renderError(errors.passwordConfirmation.message)}
            </div>
          </div>

          {/* Description Field */}
          <div className="mb-3">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 mr-2" />
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Hablanos sobre ti"
            />
            {errors.description && renderError(errors.description.message)}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={botonMysqlActive}
              className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${botonMysqlActive ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"}  transition-colors`}
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MysqlModal;
