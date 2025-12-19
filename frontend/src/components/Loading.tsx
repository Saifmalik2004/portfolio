const BackendLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img
        src="/loader.gif"
        alt="Loading"
        className="w-40 h-40 mb-6"
      />

      <h2 className="text-lg font-semibold mb-2">
        Waking up the server 😴 → 🚀
      </h2>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        This delay is <b>not an optimization issue</b>.  
        The backend is hosted on a <b>free deployment</b> and goes to sleep
        when inactive. Please wait a moment.
      </p>
    </div>
  );
};

export default BackendLoader;
