import { useDeviceType } from "@/hooks/useDeviceType";
import { Card, Flex, Image } from "antd";
import LightMarkdown from "@/components/LightMarkdown/LightMarkdown";
import clsx from "clsx";

interface RaceClassDescriptionProps {
  subject: string;
  description: string;
  image?: string;
}

const getCardClassNames = (className?: string) =>
  clsx(className, "overflow-hidden");
const getFlexClassNames = (isMobile: boolean) =>
  clsx("items-start", {
    "flex-col-reverse": isMobile,
  });
const getImageClassNames = (isMobile: boolean) =>
  clsx("bg-spring-wood", "p-4", "rounded-md", {
    "w-full": isMobile,
    "w-1/4 flex-shrink-0": !isMobile,
  });
const getTextClassNames = (isMobile: boolean) =>
  clsx("text-justify", {
    "flex-1": !isMobile,
  });

const RaceClassDescription: React.FC<
  RaceClassDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, subject, image, description }) => {
  const { isMobile } = useDeviceType();

  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking wide">{subject}</span>
      }
      className={getCardClassNames(className)}
    >
      <Flex
        gap={16}
        vertical={isMobile}
        className={getFlexClassNames(isMobile)}
      >
        <div className={getTextClassNames(isMobile)}>
          <LightMarkdown>{description}</LightMarkdown>
        </div>
        <div className={getImageClassNames(isMobile)}>
          <Image src={`/${image}.webp`} className="w-full" preview={false} />
        </div>
      </Flex>
    </Card>
  );
};

export default RaceClassDescription;
