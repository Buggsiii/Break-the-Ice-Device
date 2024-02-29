export default function ControllerStatus({
  connected = false,
}: {
  connected?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <div className={`indicator ${connected && 'active'}`} />
      <p>Controller</p>
    </div>
  );
}

ControllerStatus.defaultProps = {
  connected: false,
};
