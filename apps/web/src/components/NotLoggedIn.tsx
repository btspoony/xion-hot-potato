import { useAbstraxionAccount, useModal } from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, PageTitle, SubsectionTitle } from "./ui/Typography";
import content from "../content/landing.json";

const ActionCard = ({
  title,
  description,
  link,
  link_text,
  onClick,
  isConnecting,
}: {
  title: string;
  description: string;
  link: string;
  link_text: string;
  onClick?: () => void;
  isConnecting?: boolean;
}) => {
  return (
    <section className="flex flex-col gap-2 max-w-[375px] bg-white/5 rounded-lg p-8">
      <header className="mb-4">
        <SubsectionTitle>{title}</SubsectionTitle>
        <p>{description}</p>
      </header>
      <BaseButton
        onClick={onClick ? onClick : () => window.open(link, "_blank")}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : link_text}
      </BaseButton>
    </section>
  );
};

export function NotLoggedIn() {
  const [isShowingModal, setShowModal] = useModal();
  const { isConnecting } = useAbstraxionAccount();

  const handleLoginClick = () => {
    setShowModal(true);
  };

  return (
    <article className="flex flex-col items-center">
      <PageTitle className="text-center mb-4">{content.title}</PageTitle>
      <MutedText className="mb-8 text-center text-xl">
        {content.tagline}
      </MutedText>
      <div className="flex flex-col gap-4 md:flex-row ">
        {content.action_cards.map((card, index) => (
          <ActionCard
            key={index}
            isConnecting={isShowingModal || isConnecting}
            {...card}
            onClick={index === 0 ? handleLoginClick : undefined}
          />
        ))}
      </div>
    </article>
  );
}
