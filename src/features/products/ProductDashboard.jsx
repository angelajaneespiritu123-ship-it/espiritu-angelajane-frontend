export default function ProductDashboard({
  user,
  products,
  loading,
  searchQuery,
  stockFilter,
  message,
  lowStockCount,
  totalUnits,
  inventoryValue,
  filteredProducts,
  setSearchQuery,
  setStockFilter,
  loadProducts,
  openAddForm,
  openEditForm,
  deleteProduct,
  setMessage,
  logout,
}) {
  return (
    <div className="inventory-app">
      <aside className="app-sidebar">
        <a className="brand" href="#dashboard" aria-label="Kanto Store dashboard">
          <span className="brand-mark">K</span>
          <span className="brand-copy"><strong>KANTO</strong><span>SARI-SARI STORE</span></span>
        </a>
        <div className="sidebar-label">TINDAHAN DESK</div>
        <nav className="sidebar-nav" aria-label="Store navigation">
          <a className="sidebar-link" href="#dashboard"><span className="sidebar-link-icon">⌂</span>Storefront</a>
          <a className="sidebar-link is-current" href="#inventory-list"><span className="sidebar-link-icon">▤</span>Stock list<span className="sidebar-count">{products.length}</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="store-status"><span className="live-dot" /><span><strong>Tindahan open</strong><small>Stock list is up to date</small></span></div>
          <div className="sidebar-account">
            <span className="account-avatar">{user.username?.charAt(0).toUpperCase() || "U"}</span>
            <span className="sidebar-user-copy"><small>Signed in as</small><strong>{user.username}</strong></span>
          </div>
          <button className="sidebar-logout" onClick={logout}>Log out <span aria-hidden="true">↗</span></button>
        </div>
      </aside>

      <div className="workspace">
        <header className="workspace-topbar">
          <div className="workspace-crumb"><span>KANTO STORE</span><i>/</i> DAILY STOCK</div>
          <div className="workspace-date"><span className="live-dot" /> STORE OPEN <i /> DAILY STOCK</div>
        </header>

        <main className="inventory-main" id="dashboard">
          <section className="store-banner" aria-label="Kanto Store daily stock overview">
            <div className="banner-shade" />
            <div className="banner-copy">
              <span className="eyebrow eyebrow-light">NEIGHBORHOOD STORE / DAILY STOCK</span>
              <h1>Tindahan inventory<span>.</span></h1>
              <p>Paninda, bilang, at presyong laging updated.</p>
            </div>
            <div className="banner-index"><span>KANTO STORE</span><strong>01</strong><span>DAILY LIST</span></div>
          </section>

          <section className="stats-grid" aria-label="Inventory summary">
            <article className="stat-card stat-card-primary">
              <span className="stat-label">CATALOGUE ITEMS</span>
              <strong className="stat-value">{products.length.toLocaleString()}</strong>
              <span className="stat-foot">Products in your catalogue</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">UNITS ON HAND</span>
              <strong className="stat-value">{totalUnits.toLocaleString()}</strong>
              <span className="stat-foot">Across all products</span>
            </article>
            <article className="stat-card">
              <span className="stat-label">STOCK VALUE</span>
              <strong className="stat-value stat-value-money">₱{inventoryValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              <span className="stat-foot">Retail value on hand</span>
            </article>
            <article className={`stat-card ${lowStockCount ? "stat-card-alert" : ""}`}>
              <span className="stat-label">LOW STOCK</span>
              <strong className="stat-value">{lowStockCount.toLocaleString()}</strong>
              <span className="stat-foot">Items with 1–5 units</span>
            </article>
          </section>

          {message && (
            <div className={`dashboard-alert ${/unable|failed|required|valid|login|not found|unauthorized/i.test(message) ? "is-error" : "is-success"}`} role="status">
              <span className="alert-mark" aria-hidden="true">{/unable|failed|required|valid|login|not found|unauthorized/i.test(message) ? "!" : "✓"}</span>
              <span>{message}</span>
              <button className="alert-dismiss" onClick={() => setMessage("")} aria-label="Dismiss message">×</button>
            </div>
          )}

          <section className="products-section" id="inventory-list" aria-labelledby="products-heading">
            <div className="section-heading">
              <div>
                <span className="eyebrow">PRODUCT DIRECTORY</span>
                <h2 id="products-heading">Your inventory<span className="heading-period">.</span></h2>
              </div>
              <div className="section-actions">
                <button className="refresh-action" onClick={() => loadProducts()} disabled={loading}>
                  <span aria-hidden="true">↻</span> {loading ? "Refreshing" : "Refresh"}
                </button>
                <button className="add-action" onClick={openAddForm}><span aria-hidden="true">＋</span> Add product</button>
              </div>
            </div>

            <div className="inventory-toolbar">
              <label className="search-box">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products or descriptions"
                  aria-label="Search products"
                />
                {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">×</button>}
              </label>
              <div className="stock-filters" role="group" aria-label="Filter products by stock status">
                {[
                  ["all", "All items", products.length],
                  ["in-stock", "In stock", products.filter((product) => Number(product.quantity) > 5).length],
                  ["low-stock", "Low stock", lowStockCount],
                  ["out-of-stock", "Out of stock", products.filter((product) => Number(product.quantity) === 0).length],
                ].map(([value, label, count]) => (
                  <button
                    className={`stock-filter ${stockFilter === value ? "is-active" : ""}`}
                    key={value}
                    onClick={() => setStockFilter(value)}
                    aria-pressed={stockFilter === value}
                  >
                    {label}<span>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="products-table-wrap">
              <table className="products-table">
                <thead>
                  <tr><th>PRODUCT</th><th>UNIT PRICE</th><th>QUANTITY</th><th>STOCK STATUS</th><th>ADDED</th><th>ACTIONS</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="table-message"><span className="loading-mark" /> Loading your inventory…</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="6" className="table-message empty-message">
                      <span className="empty-symbol" aria-hidden="true">□</span>
                      <strong>{products.length === 0 ? "Nothing in the warehouse yet" : "No matching products"}</strong>
                      <span>{products.length === 0 ? "Add your first item to start tracking inventory." : "Try a different search or stock filter."}</span>
                      {products.length === 0 && <button className="add-action empty-add" onClick={openAddForm}>＋ Add your first product</button>}
                    </td></tr>
                  ) : filteredProducts.map((product) => {
                    const quantityValue = Number(product.quantity || 0);
                    const stockStatus = quantityValue === 0
                      ? ["out", "Out of stock"]
                      : quantityValue <= 5
                        ? ["low", "Low stock"]
                        : ["in", "In stock"];

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <span className="product-avatar">{product.product_name?.charAt(0).toUpperCase() || "P"}</span>
                            <span className="product-info"><strong>{product.product_name}</strong><span>{product.description || "No description"}</span></span>
                          </div>
                        </td>
                        <td className="price-cell">₱{Number(product.price || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td><span className="quantity-cell">{quantityValue.toLocaleString()} <small>units</small></span></td>
                        <td><span className={`stock-badge stock-${stockStatus[0]}`}><span />{stockStatus[1]}</span></td>
                        <td className="date-cell">{product.created_at ? new Date(product.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                        <td>
                          <div className="row-actions">
                            <button className="row-action edit-row-action" onClick={() => openEditForm(product)} aria-label={`Edit ${product.product_name}`} title="Edit product">Edit</button>
                            <button className="row-action delete-row-action" onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.product_name}`} title="Delete product">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <footer className="table-footer"><span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span><span>KANTO STORE <i>·</i> PANINDA</span></footer>
          </section>
        </main>
      </div>
    </div>
  );
}
