package service

import (
	"github.com/chain-works/ominode/setting/operation_setting"
	"github.com/chain-works/ominode/setting/system_setting"
)

func GetCallbackAddress() string {
	if operation_setting.CustomCallbackAddress == "" {
		return system_setting.ServerAddress
	}
	return operation_setting.CustomCallbackAddress
}
