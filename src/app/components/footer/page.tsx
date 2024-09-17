const Footer = () => {
    const footerItems = [
        { name: 'Qui sommes-nous ?', link: '/about' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Contacter EasyOrder', link: '/contact' }
    ]

    return (
        <footer className={'bg-easyorder-black w-full h-28'}>
            <ul className={'container w-full h-full flex items-center justify-center gap-x-20 flex-wrap'}>
                {footerItems.map((item, index) => (
                    <li key={index}>
                        <a href={item.link} className="text-white hover:text-gray-300">{item.name}</a>
                    </li>
                ))}
            </ul>
        </footer>
    )
}

export default Footer