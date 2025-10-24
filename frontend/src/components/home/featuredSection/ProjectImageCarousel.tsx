

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { EmblaCarouselType } from "embla-carousel";
import { ImageUploadResponse } from "@/types/project";

interface ProjectImageCarouselProps {
  images: ImageUploadResponse[] | undefined;
  title?: string;
}

export const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({
  images,
  title,
}) => {
  const [api, setApi] = React.useState<EmblaCarouselType>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div className="relative bg-gray-100 rounded-2xl h-64 sm:h-80 md:h-96 flex items-center justify-center">
        <p className="text-gray-500 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden rounded-2xl backdrop-blur-xl bg-white/20 shadow-2xl border border-white/30">
                <CardContent className="p-0">
                  <img
                    src={image.url}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10" />
        <CarouselNext className="right-3 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10" />
      </Carousel>

      {/* Indicators */}
      <div className="flex justify-center mt-3 sm:mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-cyan-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
