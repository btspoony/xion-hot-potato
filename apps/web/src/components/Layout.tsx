import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { NotLoggedIn } from "./NotLoggedIn";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { client, logout } = useAbstraxionSigningClient();
  const { data: account } = useAbstraxionAccount();

  const [, setShowModal] = useModal();

  const handleLoginClick = () => {
    if (client) {
      logout?.();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Abstraxion onClose={() => setShowModal(false)} />
      {client ? (
        <>
          <header className="flex justify-between items-center w-full border-b border-white/20 py-5 px-8 sm:px-24 mb-4">
            <div className="flex flex-col items-start justify-center">
              <span className="text-2xl font-bold">Hey, Friend!</span>
              <span className="text-xs text-secondary-text bg-amber-300/20 rounded-md px-1.5 py-0.5">{account?.bech32Address}</span>
            </div>
            <nav>
              <BaseButton
                className="hover:cursor-pointer"
                onClick={handleLoginClick}
              >
                {client ? "Logout" : "Login"}
              </BaseButton>
            </nav>
          </header>
          <main className="flex justify-between items-center w-full py-5 px-8 sm:px-24 mb-4">
            {children}
          </main>
        </>
      ) : (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 flex flex-col items-center justify-center">
            <NotLoggedIn />
          </main>
          <footer className="flex h-[100px] p-8">
            <Footer />
          </footer>
        </div>
      )}
    </>
  );
}
