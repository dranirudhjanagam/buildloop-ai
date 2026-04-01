const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-primary"
        style={{
          animation: "typing-dot 1.4s infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

export default TypingIndicator;
