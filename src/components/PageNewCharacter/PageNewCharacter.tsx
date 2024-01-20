import {
  Breadcrumb,
  BreadcrumbProps,
  Button,
  Col,
  Flex,
  Row,
  Steps,
  message,
} from "antd";
import { User } from "firebase/auth";
import React from "react";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
import { UserAddOutlined } from "@ant-design/icons";
import { CharData } from "@/data/definitions";
import { useNavigate } from "react-router-dom";
import NewContentWrapper from "@/components/NewContentWrapper/NewContentWrapper";
import {
  addCharacterData,
  getStepsItems,
  isNextButtonEnabled,
} from "@/support/pageNewCharacterSupport";

interface PageNewCharacterProps {
  user: User | null;
}

const breadcrumbItems: BreadcrumbProps["items"] = [
  { title: <BreadcrumbHomeLink /> },
  {
    title: (
      <div>
        <UserAddOutlined className="mr-2" />
        <span>New Character</span>
      </div>
    ),
  },
];

const PageNewCharacter: React.FC<
  PageNewCharacterProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  // HOOKS
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [character, setCharacter] = React.useState<CharData>({
    level: 1,
    xp: 0,
  } as CharData);
  const [comboClass, setComboClass] = React.useState(false);
  const [comboClassSwitch, setComboClassSwitch] = React.useState(
    character.class?.length > 1,
  );
  const [messageApi, contextHolder] = message.useMessage();
  // VARS
  const next = () => {
    console.log(character);
    setCurrentStep(currentStep + 1);
  };
  const prev = () => {
    console.log(character);
    setCurrentStep(currentStep - 1);
  };
  const stepsItems = getStepsItems(
    character,
    setCharacter,
    setComboClass,
    setComboClassSwitch,
    comboClass,
    comboClassSwitch,
  );
  const items = stepsItems.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      {contextHolder}
      <Breadcrumb items={breadcrumbItems} />
      <Row className={className} gutter={16}>
        <Col xs={24} sm={5}>
          <Steps
            progressDot
            current={currentStep}
            direction="vertical"
            items={items}
            className="hidden sm:block"
          />
        </Col>
        <Col xs={24} sm={19}>
          <NewContentWrapper
            title={stepsItems[currentStep].fulltitle}
            markedDesc={stepsItems[currentStep].description}
          >
            <Flex gap={16} justify="space-between">
              {currentStep > 0 && (
                <Button onClick={() => prev()}>Previous</Button>
              )}
              {currentStep < stepsItems.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => next()}
                  disabled={!isNextButtonEnabled(currentStep, character)}
                  className="[&:only-child]:ml-auto"
                >
                  Next
                </Button>
              )}
              {currentStep === stepsItems.length - 1 && (
                <Button
                  type="primary"
                  onClick={() =>
                    addCharacterData(
                      character,
                      messageApi,
                      setCharacter,
                      setCurrentStep,
                      navigate,
                    )
                  }
                  disabled={!isNextButtonEnabled(currentStep, character)}
                >
                  Done
                </Button>
              )}
            </Flex>
            {stepsItems[currentStep].content}
          </NewContentWrapper>
        </Col>
      </Row>
    </>
  );
};

export default PageNewCharacter;
