export default function ControllerStatus({
  index,
  connected = false,
}: {
  index: number;
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
      <p>Controller {index}</p>
    </div>
  );
}

ControllerStatus.defaultProps = {
  connected: false,
};
