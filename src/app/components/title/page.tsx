const Title = ({ children, className }: any) => {
    return (
        <h1 className={"text-3xl font-semibold text-center my-6 " + className}>
            {children}
        </h1>
    );
}

export default Title;