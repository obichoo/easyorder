const Footer = () => {
    const footerItems = [
        { name: 'Qui sommes-nous ?', link: '/about' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Contacter EasyOrder', link: '/contact' }
    ];

    return (
        <footer className="bg-easyorder-black w-full py-6">
            <div className="container mx-auto">
                <ul className="flex items-center justify-center gap-x-10 flex-wrap">
                    {footerItems.map((item, index) => (
                        <li key={index}>
                            <a href={item.link} className="text-white text-sm md:text-base font-semibold hover:text-easyorder-green transition duration-300">
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="text-center text-white mt-8">
                    <p className="text-xs md:text-sm">&copy; {new Date().getFullYear()} EasyOrder. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
