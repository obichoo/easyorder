'use client';

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Link from "next/link";

export interface CarouselSlide {
    link?: string,
    image?: string,
    text: string,
    data?: any
}

interface CarouselProps {
    slides?: CarouselSlide[],
    options?: any,
    slidesPerView?: number,
    slidesHeight?: string,
    slidesSpacing?: string,
    type?: 'category' | 'product' | string,
    [key: string]: any
}

const Slide = ({ slide, index }: { slide: CarouselSlide, index: number }) => {
    return (
        <>
            <div className="embla__slide__number rounded-lg overflow-hidden">
                {
                    slide.image ? (
                        <div className="w-full h-full relative">
                            <img className="w-full h-full object-cover brightness-75" src={slide.image} alt={slide.text}/>
                            <p className="text-white text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{slide.text}</p>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#e7e6e6] flex items-center justify-center">
                            <p className="text-[#032035] text-2xl">{slide.text}</p>
                        </div>
                    )
                }
            </div>
        </>
    )
}

const Carousel = ({slides, options, slidesPerView, slidesHeight, slidesSpacing, type}: CarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    return (
        <section
            className="embla"
            style={{
                ['--slide-size' as string]: `${slidesPerView ? 100 / (slidesPerView || 1) + '%' : '100%'}`,
                ['--slide-height' as string]: slidesHeight || '19rem',
                ['--slide-spacing' as string]: slidesSpacing || '1rem'
            }}
        >
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides?.map?.((value: any, index: any) => {
                        if (type) {
                            if (type === 'product') {
                                return (
                                    <Link
                                        key={value?.data?._id}
                                        href={value.link as string}
                                        className="embla__slide"
                                    >
                                        <div className="bg-white border border-[#77ad86] rounded-lg overflow-hidden hover:shadow-lg transition duration-300 transform">
                                            <div className="flex justify-center items-center">
                                                {value?.data.pictures && value?.data.pictures[0]?.url ? (
                                                    <img src={value?.data.pictures[0].url} alt={value.text} className="object-cover h-[150px] w-[150px]" />
                                                ) : (
                                                    <img src="https://via.placeholder.com/150" alt="Placeholder" className="object-cover h-full w-full" />
                                                )}
                                            </div>
                                            <div className="p-4 text-center truncate">
                                                <p className="font-bold text-[#032035] truncate">{value.text}</p>
                                                <p className="text-[#77ad86]">{((value?.data?.price_in_cent as number) / 100).toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            } else if (type === 'category') {
                                return (
                                    <Link
                                        key={index}
                                        href={value.link as string}
                                        className="embla__slide"
                                    >
                                        <div className="bg-[#77ad86] text-white hover:bg-[#032035] text-center py-2 px-4 rounded-lg transition duration-300 transform shadow-md">
                                            {value.text}
                                        </div>
                                    </Link>
                                )
                            }
                        } else if (value.link) {
                            return (
                                <Link key={index} className="embla__slide" href={value.link}>
                                    <Slide slide={value} index={index} key={index} />
                                </Link>
                            )
                        } else {
                            return (
                                <div className="embla__slide" key={index}>
                                    <Slide slide={value} index={index} key={index} />
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </section>
    )
}

export default Carousel
