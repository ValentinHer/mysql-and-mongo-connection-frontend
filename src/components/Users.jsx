import { useEffect, useState } from "react";
import { Users as UsersIcon, Database, PencilIcon, Trash2 } from "lucide-react";
import { getMysqlUsers, deleteMysqlUser } from "../hooks/mysqlUsers.hook";
import { getUsers, deleteUser } from "../hooks/mongoDbUsers.hook";
import MongoModal from "./mongoModalUpdate";
import MysqlModal from "./MysqlModalUpdate";
import Alertmessage from "./AlertMessage";

function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMysqlModalOpen, setIsMysqlModalOpen] = useState(false);
  const [selectedMysqlUser, setSelectedMysqlUser] = useState(false);
  const [selectedDb, setSelectedDb] = useState("mongo");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [isDeleteMysqlModalOpen, setIsDeleteMysqlModalOpen] = useState(false);
  const [userMysqlToDelete, setUserMysqlToDelete] = useState(null);

  const [isDeleteMongoModalOpen, setIsDeleteMongoModalOpen] = useState(false);
  const [userMongoToDelete, setUserMongoToDelete] = useState(null);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmMysqlDelete = async () => {
    if (userMysqlToDelete) {
      const result = await deleteMysqlUser(userMysqlToDelete);
      if (result.type == "error") {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => setAlertMessage(""), 3000);
      } else {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => setAlertMessage(""), 3000);
        window.location.reload();
      }
    }
    handleCloseDeleteMysqlModal();
  };

  const handleConfirmMongoDelete = async () => {
    if (userMongoToDelete) {
      const result = await deleteUser(userMongoToDelete);
      if (result.type == "error") {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => setAlertMessage(""), 3000);
      } else {
        setAlertMessage(result.message);
        setAlertType(result.type);
        setTimeout(() => setAlertMessage(""), 3000);
        window.location.reload();
      }
    }
    handleCloseDeleteMongoModal();
  };

  const handleOpenDeleteMysqlModal = (userId) => {
    setUserMysqlToDelete(userId);
    setIsDeleteMysqlModalOpen(true);
  };

  const handleOpenDeleteMongoModal = (userId) => {
    setUserMongoToDelete(userId);
    setIsDeleteMongoModalOpen(true);
  };

  const handleCloseDeleteMysqlModal = () => {
    setIsDeleteMysqlModalOpen(false);
    setUserMysqlToDelete(null);
  };

  const handleCloseDeleteMongoModal = () => {
    setIsDeleteMongoModalOpen(false);
    setUserMongoToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openMysqlModal = (user) => {
    setSelectedMysqlUser(user);
    setIsMysqlModalOpen(true);
  };

  const closeMysqlModal = () => {
    setIsMysqlModalOpen(false);
  };

  useEffect(() => {
    async function getAllUsers() {
      if (selectedDb == "mysql") {
        const result = await getMysqlUsers();
        setUsers(result);
        console.log(result);
      } else {
        const result = await getUsers();
        setUsers(result);
        console.log(result);
      }
    }

    getAllUsers();
  }, [selectedDb]);

  const renderMongoTable = () => (
    <div>
      {alertMessage && (
        <Alertmessage alertType={alertType} message={alertMessage} />
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen de Perfil
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 w-md py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Registro
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={user?.image_url}
                  className="w-32 h-32 object-cover rounded-md mx-auto"
                />
              </td>
              <td className="px-6 text-center py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-4 max-w-24 text-center max-h-24 overflow-y-auto text-sm text-gray-500">
                <div className="text-sm text-gray-500 break-words">
                  {user.description}
                </div>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-gray-500">
                {new Date(user.date_signup).toISOString().split("T")[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <button
                  className="text-white bg-indigo-600 rounded-sm p-1 cursor-pointer w-10 hover:bg-indigo-500  hover:text-white mr-3"
                  onClick={() => openModal(user)}
                >
                  <PencilIcon className="w-5 h-5 mx-auto" />
                </button>
                <button
                  className="text-white bg-red-600 p-1 w-10 rounded-sm cursor-pointer hover:bg-red-500"
                  onClick={() => handleOpenDeleteMongoModal(user._id)}
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <MongoModal closeModal={closeModal} user={selectedUser} />
      )}
      {isDeleteMongoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 bg-neutral-500/50 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Estás seguro?
            </h2>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Quieres eliminar este usuario?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDeleteMongoModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMongoDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMysqlTable = () => (
    <div>
      {alertMessage && (
        <Alertmessage alertType={alertType} message={alertMessage} />
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen de Perfil
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 w-md py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Registro
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user) => (
            <tr key={user.id_user} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={user.image_url}
                  className="w-32 h-32 object-cover rounded-md mx-auto"
                />
              </td>
              <td className="px-6 text-center py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-4 max-w-24 text-center max-h-24 overflow-y-auto text-sm text-gray-500">
                <div className="text-sm text-gray-500 break-words">
                  {user.description}
                </div>
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap text-gray-500">
                {new Date(user.date_signup).toISOString().split("T")[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <button
                  className="text-white bg-indigo-600 rounded-sm p-1 cursor-pointer w-10 hover:bg-indigo-500  hover:text-white mr-3"
                  onClick={() => openMysqlModal(user)}
                >
                  <PencilIcon className="w-5 h-5 mx-auto" />
                </button>
                <button
                  className="text-white bg-red-600 p-1 w-10 rounded-sm cursor-pointer hover:bg-red-500"
                  onClick={() => handleOpenDeleteMysqlModal(user.id_user)}
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isMysqlModalOpen && (
        <MysqlModal closeModal={closeMysqlModal} user={selectedMysqlUser} />
      )}
      {isDeleteMysqlModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 bg-neutral-500/50 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Estás seguro?
            </h2>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Quieres eliminar este usuario?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDeleteMysqlModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMysqlDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <UsersIcon className="w-6 h-6 mr-2" />
              Usuarios
            </h2>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-gray-600" />
              <select
                value={selectedDb}
                onChange={(e) => setSelectedDb(e.target.value)}
                className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="mongo">MongoDB</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {selectedDb === "mongo" ? renderMongoTable() : renderMysqlTable()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
