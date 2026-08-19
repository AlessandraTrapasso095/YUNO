import { Skeleton } from "../components/ui";

export default function DiscoverLoading() {
  return (
    <main className="discover-loading" aria-busy="true" aria-label="Loading">
      <aside className="discover-loading__sidebar">
        <Skeleton width="120px" height="34px" />

        <div className="discover-loading__nav">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} width="100%" height="42px" />
          ))}
        </div>

        <Skeleton width="100%" height="130px" />
      </aside>

      <section className="discover-loading__main">
        <header className="discover-loading__header">
          <div>
            <Skeleton width="100px" height="11px" />
            <Skeleton width="280px" height="34px" />
            <Skeleton width="210px" height="14px" />
          </div>

          <Skeleton width="110px" height="42px" />
        </header>

        <div className="discover-loading__search">
          <Skeleton width="100%" height="48px" />
          <Skeleton width="106px" height="48px" />
        </div>

        <div className="discover-loading__chips">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width={`${72 + index * 9}px`} height="32px" />
          ))}
        </div>

        <div className="discover-loading__stage">
          <Skeleton width="100%" height="100%" />
        </div>
      </section>

      <aside className="discover-loading__context">
        <Skeleton width="150px" height="20px" />
        <Skeleton width="100%" height="90px" />
        <Skeleton width="100%" height="90px" />
        <Skeleton width="100%" height="90px" />
      </aside>
    </main>
  );
}
