function notify() {
  local start_time=$(date +%s)
  
  local cmd_to_run=("$@")
  "${cmd_to_run[@]}"
  
  local cmd_status=$?
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  local formatted_time=""
  local hours=$((duration / 3600))
  local minutes=$(((duration % 3600) / 60))
  local seconds=$((duration % 60))

  if [ $hours -gt 0 ]; then
    formatted_time="${hours}h ${minutes}m"
  elif [ $minutes -gt 0 ]; then
    formatted_time="${minutes}m ${seconds}s"
  else
    formatted_time="${seconds}s"
  fi

  local message=""
  local success_emoji="✅"
  local failure_emoji="❌"

  if [ $cmd_status -eq 0 ]; then
    message="${success_emoji} Succeeded after ${formatted_time}"
  else
    message="${failure_emoji} Failed (status: ${cmd_status}) after ${formatted_time}"
  fi

  echo -e '\033]777;notify;;'"$message"''
  return 0
}
