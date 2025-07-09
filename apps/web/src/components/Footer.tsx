const FooterLogin = () => {
  return (
    <div className="self-end pointer-events-auto w-full z-[1000] flex flex-col gap-2 sm:gap-12 pb-safe items-center sm:flex-row sm:justify-between sm:items-end">
      <div className="flex gap-2 justify-center items-end sm:my-0">
        <p className="text-xs sm:text-sm text-secondary-text mb-0.5 sm:mb-1.5 text-nowrap">
          Built on
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <a
            href="https://xion.burnt.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:cursor-pointer text-white"
          >
            Xion
          </a>
          <div
            className={`flex justify-between items-center h-[18px] text-testnet bg-testnet-bg px-1 py-0 ml-2 mt-1.5 sm:ml-0 sm:mb-2 rounded-[4px] text-[10px] tracking-widest`}
          >
            TESTNET
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterLogin;
