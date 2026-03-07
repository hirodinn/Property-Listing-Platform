function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div
        className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent"
        style={{
          borderColor: "var(--color-border)",
          borderTopColor: "var(--color-secondary)",
        }}
      />
    </div>
  );
}

export default Spinner;
