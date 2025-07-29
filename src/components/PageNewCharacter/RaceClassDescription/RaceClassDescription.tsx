import { useDeviceType } from "@/hooks/useDeviceType";
import { Card, Flex, Image } from "antd";
import Markdown from "react-markdown";

interface RaceClassDescriptionProps {
  subject: string;
  description: string;
  image?: string;
}

const RaceClassDescription: React.FC<
  RaceClassDescriptionProps & React.ComponentPropsWithRef<"div">
> = ({ className, subject, image, description }) => {
  const { isMobile } = useDeviceType();
  return (
    <Card
      title={
        <span className="font-enchant text-3xl tracking wide">{subject}</span>
      }
      className={className + " overflow-hidden"}
    >
      <Flex
        gap={8}
        vertical={isMobile}
        className={isMobile ? "flex-col-reverse" : ""}
      >
        <div className="text-justify">
          <Markdown>{description}</Markdown>
        </div>
        <Image src={`/${image}.webp`} className="w-64" preview={false} />
      </Flex>
    </Card>
  );
};

export default RaceClassDescription;
