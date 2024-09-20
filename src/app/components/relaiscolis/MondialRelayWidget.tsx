'use client';

import { useEffect } from 'react';

const MondialRelayWidget = ({ onParcelShopSelected }) => {
    useEffect(() => {
        const loadScripts = async () => {
            const jQueryScript = document.createElement('script');
            jQueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';
            jQueryScript.async = true;
            document.body.appendChild(jQueryScript);

            jQueryScript.onload = () => {
                console.log("jQuery chargé");

                const widgetScript = document.createElement('script');
                widgetScript.src = 'https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js';
                widgetScript.async = true;
                document.body.appendChild(widgetScript);

                widgetScript.onload = () => {
                    console.log("Widget Mondial Relay chargé");

                    if (window.$) {
                        window.$("#Zone_Widget").MR_ParcelShopPicker({
                            Target: "#ParcelShopCode",
                            Brand: "CC22ODIW", // code client Mondial Relay
                            Country: "FR",
                            EnableGmap: true,
                            OnParcelShopSelected: (data) => {
                                console.log("Point relais sélectionné :", data);
                                onParcelShopSelected({
                                    street: data.Adresse1,
                                    postalCode: data.CP,
                                    city: data.Ville,
                                    country: data.Pays
                                });
                            },
                            OnError: (error) => {
                                console.error("Erreur lors du chargement des points relais : ", error);
                            }
                        });
                    } else {
                        console.error("jQuery n'est pas disponible");
                    }
                };
            };
        };

        loadScripts();

        return () => {
            if (window.$) {
                window.$("#Zone_Widget").MR_ParcelShopPicker("destroy");
            }
        };
    }, [onParcelShopSelected]);

    return (
        <div>
            <div id="Zone_Widget" className="mb-4"></div>
            <input type="text" id="ParcelShopCode" className="border border-easyorder-gray rounded-md w-full p-2" placeholder="Code du relais" readOnly />
        </div>
    );
};

export default MondialRelayWidget;
