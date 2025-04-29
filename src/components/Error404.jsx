import { Frown } from "lucide-react";

function Error404({message}) {
    return (
        <div className="text-center h-auto" >
            <Frown className="h-50 w-50 mx-auto" color="gray" />
            <h1 className="text-4xl font-bold text-gray-500" >{message}</h1>
        </div>
    );
}

export default Error404;