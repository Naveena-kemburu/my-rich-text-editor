import React, { useState, useEffect } from 'react'

const SIMULATED_USERS = [
  { id: 1, name: 'Current User', color: '#4CAF50', active: true },
  { id: 2, name: 'Other User 1', color: '#2196F3', active: false },
  { id: 3, name: 'Other User 2', color: '#FF9800', active: false }
]

function PresenceIndicators() {
  const [users, setUsers] = useState(SIMULATED_USERS)

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === 1) return user
          return {
            ...user,
            active: Math.random() > 0.5
          }
        })
      )
    }, 2000) // Changed from 5000ms to 2000ms (2 seconds)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="presence-indicators" role="status" aria-label="Active users">
      <span className="presence-label">Active users:</span>
      <div className="presence-list">
        {users.map(user => (
          <div
            key={user.id}
            className={`presence-indicator ${user.active ? 'active' : 'inactive'}`}
            title={`${user.name} - ${user.active ? 'active' : 'inactive'}`}
            aria-label={`${user.name} - ${user.active ? 'active' : 'inactive'}`}
          >
            <span
              className="presence-dot"
              style={{ backgroundColor: user.color }}
            />
            <span className="presence-name">
              {user.name}
              <span className="presence-status">
                {user.active ? ' ● ONLINE' : ' ○ OFFLINE'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(PresenceIndicators)
