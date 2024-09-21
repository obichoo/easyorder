import {Spinner} from "@nextui-org/spinner";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-72">
            <Spinner label="Chargement..." size="lg" color={'current'} className="text-easyorder-green border-easyorder-green" />
        </div>
    )
}

export default Loading;